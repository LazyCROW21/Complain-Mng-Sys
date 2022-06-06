const mongoose = require('mongoose')
const validator = require('validator')

const complainSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Invalid email')
            }
        }
    },
    addressline: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'new'
    }
}, {
    timestamps: true
})

const Complain = mongoose.model('Complain', complainSchema)

module.exports = Complain