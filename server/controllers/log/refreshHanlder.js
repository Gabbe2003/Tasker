const User = require('../../models/usersSchema');
const jwt = require('jsonwebtoken');
const errorMessages = require('../../errors/errorMessages');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        console.log('No refresh token cookie present.');
        return res.sendStatus(401).json({'message': errorMessages.noCookieInSession });
    }

    const refreshToken = cookies.jwt;

    try {
        const foundUser = await User.findOne({ refreshToken }).exec();
        if (!foundUser) {
            console.log('Refresh token not found in any user document.');
            return res.sendStatus(403).json({ 'message': errorMessages.noCookieFound }); 
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                console.log('Error during token verification:', err);
                return res.sendStatus(403).json({'message': err});
            }
        
            console.log('Decoded token:', decoded);
        
            if (decoded.username !== foundUser.username || decoded.id !== foundUser._id.toString()) {
                console.log('Username or ID in refresh token does not match the found user.');
                console.log(`Decoded username: ${decoded.username}, FoundUser username: ${foundUser.username}`);
                console.log(`Decoded userID: ${decoded.userID}, FoundUser ID: ${foundUser._id}`);
                return res.sendStatus(403).json({'message': errorMessages.noCookieInSession });
            }
            

            //Note: Do not remove the toString() method because it's converting the values from the id to a string cause it's an obejctID.
            //I am comparing the decoded username and ID with the foundUser ID and username, I will remove it on production but right now it's there to help me see which user I get.
            // Generate a new access token
            const accessToken = jwt.sign(
                { "UserInfo": { "username": decoded.username , "userID":decoded.id} },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );

            // Generate a new refresh token
            const newRefreshToken = jwt.sign(
                { "username": foundUser.username, "id": foundUser._id.toString() },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '7d' }
            );
            
            // Replace the old refresh token with the new one in the database
            foundUser.refreshToken = newRefreshToken;
            await foundUser.save();
            console.log("New Refresh Token stored for user:", foundUser.refreshToken);


            // Send the new refresh token as a secure cookie
            res.cookie('jwt', newRefreshToken, {
                httpOnly: true,
                sameSite: 'None',
                secure: false, 
                maxAge: 7 * 24 * 60 * 60 * 1000 
            });

            console.log(`Issued new tokens for user: ${decoded.username}`);
            res.json({ accessToken }); 
        });
    } catch (error) {
        console.error('Server error while handling the refresh token:', error);
        return res.sendStatus(500).json({'message': errorMessages.internalError });
    }
};

module.exports = { handleRefreshToken };
