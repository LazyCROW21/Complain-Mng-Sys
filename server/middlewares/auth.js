const jwt = require('jsonwebtoken')
const APIError = require('../helper/api_error')

const verifyAccessToken = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if(!authHeader) {
            throw APIError.unauthorised('Please Login')
        }
        const token = authHeader.replace('Bearer ', '')
        req.token = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        next()
    } catch (e) {
        if(e.name === 'TokenExpiredError') {
            return next(APIError.unauthorised('Token expired'))
        } else if (e.name === 'JsonWebTokenError') {
            return next(APIError.unauthorised('Invalid Token'))
        }
        next(e)
    }
}

module.exports = verifyAccessToken