const { NotFoundError, BadRequestError } = require('../core/errorResponse')
const cartModel = require('../models/cartModel')
const productModel = require('../models/productModel')
const inventoryModel = require('../models/inventoryModel')
const {unGetSelectData} = require('../utils/index')
class CartServiceV2 {

    static async createCart({ user, product }) {
        const { productId, quantity } = product
        const foundProduct = await productModel.findById(productId).lean()
        if (!foundProduct) {
            throw new NotFoundError('Product not found')
        }
        const payload = {
            cart_userId: user._id,
            cart_status: 'active',
            cart_products: [{
                productId: foundProduct._id,
                name: foundProduct.product_name,
                quantity: quantity,
                totalPrice: quantity * foundProduct.product_price
            }]
        }
        const newCart = await cartModel.create(payload)
        if(!newCart){
            throw new BadRequestError('create cart fail')
        }
        return newCart
    }
    static async updateProductQuantityInCart({ user, product }) {
        const { productId, quantity } = product
        const foundProduct = await productModel.findById(productId).lean()
        if (!foundProduct) {
            throw new NotFoundError('Product not found')
        }
        
        // Tìm giỏ hàng của người dùng
        const userCart = await cartModel.findOne({
            cart_userId: user._id,
            cart_status: 'active',
            'cart_products.productId': productId
        }).lean()
    
        if (!userCart) {
            throw new NotFoundError('Cart not found')
        }
    
        const productInCart = userCart.cart_products.find(p => p.productId.toString() === productId.toString())
    
        if (!productInCart) {
            throw new NotFoundError('Product not found in cart')
        }
    
        const newQuantity = productInCart.quantity + quantity
    
        const query = {
            cart_userId: user._id,
            cart_status: 'active',
            'cart_products.productId': productId
        }
        const update = {
            $inc: { 'cart_products.$.quantity': quantity },
            $set: { 'cart_products.$.totalPrice': newQuantity * foundProduct.product_price }
        }
        const options = { new: true }
    
        const updatedCart = await cartModel.findOneAndUpdate(query, update, options).lean()
        if (!updatedCart) {
            throw new NotFoundError('Product not found in cart')
        }
        return updatedCart
    }
    

    static async insertNewProductInCart(userCart, foundProduct, product) {
        const { productId, quantity } = product;

        const updatedCart = await cartModel.findByIdAndUpdate(
            userCart._id,
            {
                $push: {
                    cart_products: {
                        productId: foundProduct._id,
                        name: foundProduct.product_name,
                        quantity
                    }
                }
            },
            { new: true }
        ).lean()

        return updatedCart
    }
    static async addToCart({ user, product }) {
        if (!product) {
            throw new BadRequestError('Product data is missing')
        }

        const { productId, quantity } = product
        const foundProduct = await productModel.findById(productId).lean()
        if (!foundProduct) {
            throw new NotFoundError('Product not found');
        }
        const productInStock = await inventoryModel.findOne({
            inven_productId: productId
        })
        if (!productInStock) {
            throw new NotFoundError('Inventory record not found for the product');
        }        
        const userCart = await cartModel.findOne({
            cart_userId: user._id,
            cart_status: 'active'
        }).lean()

        if (!userCart) {
            return await CartServiceV2.createCart({ user, product })
        }

        const productInCart = userCart.cart_products.find(
            (p) => p.productId.toString() === productId.toString()
        )

        if (productInCart) {
            if((quantity+productInCart.quantity) > productInStock.inven_stock){
                throw new BadRequestError('excess quantity in stock')
            }
            return await CartServiceV2.updateProductQuantityInCart({ user, product })
        } else {
            return await CartServiceV2.insertNewProductInCart(userCart, foundProduct, product)
        }
    }
    static async deleteProductCart({ user, product }) {
        const { productId } = product
        const updatedCart = await cartModel.findOneAndUpdate(
            {
                cart_userId: user._id,
                cart_status: 'active'
            },
            {
                $pull: { cart_products: { productId } }
            },
            { new: true } 
        ).lean()

        if (!updatedCart) {
            throw new NotFoundError('Product not found in cart')
        }
        return updatedCart
    }
    static async incOfDec_buttonCart({user, product}) {
        if (!product) {
            throw new BadRequestError('Product data is missing')
        }
    
        const { productId, newQuantity } = product
        const foundProduct = await productModel.findById(productId).lean()
        if (!foundProduct) {
            throw new NotFoundError('Product not found')
        }
        const productInStock = await inventoryModel.findOne({
            inven_productId: productId
        })
        if (!productInStock) {
            throw new NotFoundError('Inventory record not found for the product')
        }        
        if (newQuantity > productInStock.inven_stock) {
            throw new BadRequestError('Excess quantity in stock')
        }
    
        const cart = await cartModel.findOneAndUpdate({
            cart_userId: user._id,
            cart_status: 'active'
        }).lean()
    
        if (!cart) {
            throw new NotFoundError('Cart not found')
        }
    
        const productInCart = cart.cart_products.find(p => p.productId.toString() === productId)
        if (!productInCart) {
            throw new NotFoundError('Product not found in cart')
        }
    
        const updateCart = await cartModel.findOneAndUpdate({
            cart_userId: user._id,
            'cart_products.productId': productId
        }, {
            $set: {
                'cart_products.$.quantity': newQuantity,
                'cart_products.$.totalPrice': newQuantity * foundProduct.product_price
            }
        }, {
            new: true,
            lean: true
        })
        return updateCart
    }
    
}
module.exports = CartServiceV2
