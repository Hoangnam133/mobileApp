const userService = require('../services/userService')
const {SuccessResponse} = require('../core/successResponse')
class UserController{
    signUp = async(req, res, next)=>{
        new SuccessResponse({
            message: 'signUp success',
            metaData: await userService.signUp(req.body)
        }).send(res)
    }
    login = async(req, res, next)=>{
        new SuccessResponse({
            message: 'signUp success',
            metaData: await userService.login(req.body)
        }).send(res)
    }
    logout = async(req, res, next) =>{
        await userService.logout(req.keyStore)
        res.status(200).json({
            message: 'logout success'
        })
    }
    handlerRefreshToken = async(req, res, next)=>{
        new SuccessResponse({
            message: 'refreshToken success',
            metaData: await userService.handlerRefreshToken({
                refreshToken: req.refreshToken,
                userId: req.userId,
                keyStore: req.keyStore
            })
        }).send(res)
    }
}
module.exports = new UserController()