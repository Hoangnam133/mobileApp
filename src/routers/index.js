const express = require('express')
const router = express.Router()
router.use('/v2/api/user', require('./userRouter/index'))
router.use('/v2/api/shop', require('./shopRouter/index'))
router.use('/v2/api/category', require('./categoryRouter/index'))
router.use('/v2/api/subcategory', require('./subCategory/index'))
router.use('/v2/api/product', require('./productRouter/index'))
router.use('/v2/api/cart', require('./cartRouter/index'))
module.exports = router