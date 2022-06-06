const express = require('express')
const router = new express.Router()
const mongoose = require('mongoose');
const Complain = require('../models/complain.model')
const sendMail = require('../emails/transporter')
const verifyAccessToken = require('../middlewares/auth')
const APIError = require('../helper/api_error')

router.post('/', async (req, res, next) => {
    try {
        const complain = new Complain(req.body)
        await complain.save()
        res.status(201).send(complain)
        let info = await sendMail({
            to: complain.email,
            subject: "You complain is registered",
            body: "From CMS, your complain is successfully registered, please check your mail regularly for more updates"
        });
        console.log(info)
    } catch (e) {
        console.error(e)
        next(APIError.badRequest('Invalid field(s)'))
    }
})

router.get('/', verifyAccessToken, async (req, res, next) => {
    const match = {}
    const sort = {}
    if (req.query.new) {
        const query = ['new', 'working', 'resolved', 'discarded']
        match.$or = []
        for (let i = 0; i < query.length; i++) {
            if (req.query[query[i]] === 'true') {
                match.$or.push({ status: query[i] })
            }
        }
    }
    if (req.query.sort) {
        if (req.query.sort === 'NF') {
            sort['createdAt'] = -1
        } else {
            sort['createdAt'] = 1
        }
    }
    try {
        const complains = await Complain.find(match, null, { sort })
        res.send(complains)
    } catch (e) {
        console.error(e)
        next(APIError.internal())
    }
})

router.get('/:id', verifyAccessToken, async (req, res, next) => {
    try {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(APIError.badRequest('Invalid ID'))
        }
        const complain = await Complain.findById(req.params.id)
        if (!complain) {
            return next(APIError.notFound('Complain not found'))
        }
        res.send(complain)
    } catch (e) {
        console.error(e)
        next(APIError.internal())
    }
})

router.patch('/:id', verifyAccessToken, async (req, res, next) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['status']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return next(APIError.badRequest('Invalid field list'))
    }
    try {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(APIError.badRequest('Invalid ID'))
        }
        const complain = await Complain.findById(req.params.id)
        if (!complain) {
            return next(APIError.notFound('Complain not found'))
        }
        updates.forEach((updKey) => complain[updKey] = req.body[updKey])
        await complain.save()
        res.send(complain)
        if(req.body.status === 'working') {
            let info = await sendMail({
                to: complain.email,
                subject: "You complain is under progress",
                body: "From CMS, work on your complain is started, please check your mail regularly for more updates"
            });
            console.log(info)
        } else if (req.body.status === 'resolved') {
            let info = await sendMail({
                to: complain.email,
                subject: "You complain is resolved",
                body: "From CMS, sorry for your incovience, you issue is resolved please comeback if any thing happens again"
            });
            console.log(info)
        } else if (req.body.status === 'discarded') {
            let info = await sendMail({
                to: complain.email,
                subject: "You complain is discarded",
                body: "From CMS, it seems your complain is not recognised, please try again with a better explaination!"
            });
            console.log(info)
        }
    } catch (e) {
        console.error(e)
        next(APIError.badRequest('Invalid field list'))
    }
})

router.delete('/:id', verifyAccessToken, async (req, res, next) => {
    try {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(APIError.badRequest('Invalid ID'))
        }
        const complain = await Complain.findByIdAndDelete(req.params.id)
        if (!complain) {
            return next(APIError.notFound('Complain not found'))
        }
        res.send(complain)
    } catch (e) {
        next(APIError.internal())
    }
})

module.exports = router