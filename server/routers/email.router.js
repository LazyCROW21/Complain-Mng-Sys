const express = require('express')
const router = new express.Router()
const verifyAccessToken = require('../middlewares/auth')
const sendMail = require('../emails/transporter')
const APIError = require('../helper/api_error')

router.post('/', verifyAccessToken, async (req, res, next) => {
    req.body.password = 'argusadmin'
    try {
        const { email: to, subject, body } = req.body
        if(!to || !subject || !body) {
            next(APIError.badRequest('Invalid field(s)'))
        }

        let info = await sendMail({ to, subject, body });
        res.status(200).send({ info })
        console.log(info)
    } catch (e) {
        console.error(e)
        next(APIError.internal())
    }
})

module.exports = router