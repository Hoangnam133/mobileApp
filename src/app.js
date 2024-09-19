const express = require('express')


const app = express()
app.use(express.json())
// init mongodb
require('./configs/initMongodb')
// init middlewares
// init router
app.use('/',require('./routers/index'))
// handler error
app.use((req, res, next)=>{
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})
app.use ((error, req, res, next)=>{
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || 'Internal Server Error'
    })
})
module.exports = app