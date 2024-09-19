const express = require('express')
const {authentication, authorizeRoles} = require('../../auth/authUtils')
const router = express.Router()

const cartController = require('../../controllers/cartController')
const { asynHandler } = require('../../utils/handler')

router.use(authentication)
router.post('/addToCart', asynHandler(cartController.addToCart))
router.post('/deleteProductInCart', asynHandler(cartController.deleteCart))
router.post('/updateCart', asynHandler(cartController.updateCartBtn))
module.exports = router
