const jwt = require('jsonwebtoken');
const errorMessages = require('../errors/errorMessages');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ 'message': errorMessages.wrongBearer });
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ 'message': errorMessages.expiredToken });
            } else {
                return res.status(401).json({ 'message': errorMessages.expiredToken });
            }
        }
        // Token is valid, attach user info to the request
        req.user = {
            id: decoded.UserInfo.id,      
            username: decoded.UserInfo.username 
        };
       console.log(`Access token verified for user: ${req.user.username}, ${req.user.id}`);
        next();
    });
}

module.exports = verifyJWT;
