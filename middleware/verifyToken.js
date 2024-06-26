const jwt = require('jsonwebtoken');
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success')

const verifyToken = async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(createError(401, "You are not Authenticated"));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(createError(403, "Token is not valid"));
        }
        else {
            req.user = user;
        }
        next();
    })
}

const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        // if (req.user.id === req.params.id || req.user.isAdmin) {
        //     next();
        // }
        // else {
        //     return next(createError(403, "You are not authorized!"));
        // }
        next();
    })
}

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        // if (req.user.isAdmin) {
        //     next();
        // }
        // else {
        //     return next(createError(403, "You are not authorized!"));
        // }
        next()
    })
}

module.exports = {verifyToken,verifyUser,verifyAdmin}