const { Schema, model } = require('mongoose')

const cartProductSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    totalPrice:{
        type: Number,
        required: true
    }
},{
    _id: false
})
const cartSchema = new Schema({
    cart_status: {
        type: String,
        required: true,
        enum: ['active', 'unactive', 'failed', 'pending'],
        default: 'active'
    },
    cart_products: {
        type: [cartProductSchema], 
        default: [],
        required: true
    },
    cart_userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    }
}, {
    timestamps: true,
    collection: 'Carts'
})
module.exports = model('Cart', cartSchema)
