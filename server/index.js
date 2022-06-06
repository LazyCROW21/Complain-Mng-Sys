const express = require('express')
const path = require('path')
const userRouter = require('./routers/user.router')
const complainRouter = require('./routers/complain.router')
const emailRouter = require('./routers/email.router')
const errorHandler = require('./middlewares/error_handler')
require('./db/mongoose')

const app = express()

const publicPath = path.join(__dirname, '../public')

const PORT = process.env.PORT

app.use(express.static(publicPath))
app.use(express.json())

app.use('/api/users', userRouter)
app.use('/api/complains', complainRouter)
app.use('/api/email', emailRouter)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log('Server running at port:', PORT)
})