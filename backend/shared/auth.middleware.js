const jwt = require('jsonwebtoken');
const { errorResponse } = require('./response.utils');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return errorResponse(res, 'No token, authorization denied', 401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        req.user = decoded;
        next();
    } catch (err) {
        return errorResponse(res, 'Token is not valid', 401);
    }
};

module.exports = authMiddleware;
