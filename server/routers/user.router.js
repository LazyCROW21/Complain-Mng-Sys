const express = require('express')
const router = new express.Router()
const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const verifyAccessToken = require('../middlewares/auth')
const {
    signAccessToken,
    signRefreshToken
} = require('../helper/jwt_helper')
const sendMail = require('../emails/transporter')
const APIError = require('../helper/api_error')
const mongoose = require('mongoose');

router.post('/', verifyAccessToken, async (req, res, next) => {
    req.body.password = 'argusadmin'
    const user = new User(req.body)
    try {
        const accessToken = signAccessToken(user)
        const refreshToken = signRefreshToken(user)
        user.refreshTokens.push(refreshToken)
        await user.save()
        res.status(201).send({
            user,
            accessToken,
            refreshToken
        })
        let info = await sendMail({
            to: user.email,
            subject: `Welcome ${user.name}`,
            body: `Hope you understand your responsibilties to handle every customer and their complains with kindness & patience, and you will to give your 100% so solve them, your password is: ${user.password}`
        });
        console.log(info)
    } catch (e) {
        next(APIError.badRequest('Invalid field(s)'))
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const accessToken = signAccessToken(user)
        const refreshToken = signRefreshToken(user)
        user.refreshTokens.push(refreshToken)
        console.log(refreshToken)
        await user.save()
        res.send({
            user,
            accessToken,
            refreshToken
        })
    } catch (e) {
        console.error(e)
        next(APIError.unauthorised('Invalid email or password'))
    }
})

router.post('/refresh-token', async (req, res, next) => {
    try {
        const refreshToken = req.body.refreshToken
        if (!refreshToken) {
            return next(APIError.notFound('refreshToken not found'))
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findOne({
            _id: decoded._id,
            refreshTokens: refreshToken
        })
        if (!user) {
            return next(APIError.notFound('user not found'))
        }
        const accessToken = signAccessToken(user)
        res.send({
            user,
            accessToken
        })
    } catch (e) {
        console.log(e)
        next(APIError.unauthorised('Invalid refreshToken'))
    }
})

router.delete('/logout', async (req, res, next) => {
    try {
        const refreshToken = req.body.refreshToken
        if (!refreshToken) {
            return next(APIError.notFound('refreshToken not found'))
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findOne({
            _id: decoded._id,
            refreshTokens: refreshToken
        })
        if (!user) {
            return next(APIError.notFound('user not found'))
        }
        user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken)
        await user.save()
        res.send()
    } catch (e) {
        console.error(e)
        next(APIError.internal())
    }
})

router.get('/', verifyAccessToken, async (req, res, next) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        console.error(e)
        next(APIError.internal())
    }
})

router.get('/:id', verifyAccessToken, async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(APIError.badRequest('Invalid ID'))
        }
        const user = await User.findById(req.params.id)
        if (!user) {
            return next(APIError.notFound('User not found'))
        }
        res.send(user)
    } catch (e) {
        console.error(e)
        next(APIError.internal())
    }
})

router.get('/resetpwd/:id', async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(APIError.badRequest('Invalid ID'))
        }
        const user = await User.findById(req.params.id)
        if (!user) {
            return next(APIError.notFound('User not found'))
        }
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        user.password = result
        await user.save()
        let info = await sendMail({
            to: user.email,
            subject: `Password reset`,
            body: `Hi ${user.name} your password is reset to: ${result}, if it wasn't you to reset your passowrd, quicky contact the super admin.`
        });
        console.log(info)
        res.send({ success: true })
    } catch (e) {
        console.error(e)
        next(APIError.internal())
    }
})

router.patch('/:id', verifyAccessToken, async (req, res, next) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['email']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return next(APIError.badRequest('Invalid field list'))
    }
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(APIError.badRequest('Invalid ID'))
        }
        const user = await User.findById(req.params.id)
        if (!user) {
            return next(APIError.notFound('User not found'))
        }
        updates.forEach((updKey) => user[updKey] = req.body[updKey])
        await user.save()
        res.send(user)
    } catch (e) {
        console.error(e)
        next(APIError.internal())
    }
})

router.delete('/:id', verifyAccessToken, async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(APIError.badRequest('Invalid ID'))
        }
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return next(APIError.notFound('User not found'))
        }
        res.send(user)
    } catch (e) {
        console.error(e)
        next(APIError.internal())
    }
})

module.exports = router