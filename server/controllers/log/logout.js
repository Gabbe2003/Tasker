const User = require('../../models/usersSchema');
const jwt = require('jsonwebtoken');

const handleLogout = async (req, res) => {
    const refreshToken = req.cookies.jwt;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token not provided.' });
    }

    try {
        // Verify the refreshToken
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const username = decoded.username;

        // Find the user with that refreshToken
        const foundUser = await User.findOne({ username, refreshToken }).exec();

        if (!foundUser) {
            // If the user is not found or the token isn't in their list, clear the cookie anyway and return
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            return res.sendStatus(204);
        }

        // Remove the refreshToken from the user's list
        foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);
        await foundUser.save();

        // Clear the JWT cookie
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        res.sendStatus(204);
    } catch (err) {
        // If there's an error verifying the JWT
        return res.status(401).json({ message: 'Invalid token.' });
    }
}

module.exports = { handleLogout };
