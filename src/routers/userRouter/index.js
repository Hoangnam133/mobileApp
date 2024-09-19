const express = require('express')
const {authentication, handleRefreshToken} = require('../../auth/authUtils')
const router = express.Router()

const userController = require('../../controllers/userController')
const { asynHandler } = require('../../utils/handler')

router.post('/handlerRefreshToken',handleRefreshToken,asynHandler(userController.handlerRefreshToken))
router.post('/signUp', asynHandler(userController.signUp))
router.post('/login', asynHandler(userController.login))
router.use(authentication)
router.post('/logout', asynHandler(userController.logout))
module.exports = router
