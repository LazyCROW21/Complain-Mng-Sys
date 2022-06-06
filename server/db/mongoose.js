const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('Database connected successfully!')
}).catch((error) => {
    console.error(error)
})
