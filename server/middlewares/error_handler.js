const APIError = require('../helper/api_error')

const errorHandler = (err, req, res, next) => {
    console.error(err)

    if(err instanceof APIError) {
        return res.status(err.code).send({
            error: {
                message: err.message,
                code: err.code
            }
        })
    }

    res.status(500).send({
        error: {
            message: 'something went wrong',
            code: 500
        }
    })
}

module.exports = errorHandler