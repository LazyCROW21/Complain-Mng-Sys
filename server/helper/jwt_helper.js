const jwt = require('jsonwebtoken')

const signAccessToken = (user) => {
    return jwt.sign(
        { _id: user._id.toString(), name: user.name }, 
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30s' }
    )
}

const signRefreshToken = (user) => {
    return jwt.sign(
        { _id: user._id.toString(), name: user.name }, 
        process.env.REFRESH_TOKEN_SECRET
    )
}

module.exports = {
    signAccessToken,
    signRefreshToken
}