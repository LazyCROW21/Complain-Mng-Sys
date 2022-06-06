class APIError {
    constructor (code, message, data) {
        this.code = code
        this.message = message
    }

    static badRequest(msg) {
        return new APIError(400, msg)
    }

    static internal() {
        return new APIError(500, 'something went wrong')
    }

    static notFound(msg) {
        return new APIError(404, msg)
    }

    static unauthorised(msg) {
        return new APIError(401, msg)
    }
}

module.exports = APIError