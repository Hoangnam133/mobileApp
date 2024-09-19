const { NotFoundError, BadRequestError } = require('../core/errorResponse');
const CartModel = require('../models/cardModel')
const productModel = require('../models/productModel')
const inventoryModel = require('../models/inventoryModel')
const checkQuantityProduct = async(product)=>{
    const {productId, quantity} = product
    const foundInventory = await inventoryModel.findOne({ inven_productId: productId })
    if (!foundInventory) {
        throw new NotFoundError('not found product in inventory');
    }
    if (quantity > foundInventory.inven_stock) {
        throw new BadRequestError('The quantity of product requested exceeds the quantity in stock.');
    }
    return true
}
const findProductInCart = async({userId, productId})=>{
    return await CartModel.findOne({
        cart_userId: userId,
        cart_products: productId,
        cart_status: 'active'
    }).lean()
}
module.exports = {
    checkQuantityProduct,
    findProductInCart
   
}