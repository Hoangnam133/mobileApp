const {model, Schema} = require('mongoose')
const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'
const checkOutSchema = new Schema({
    totalAmount:{
        type: Number,
        default: 0,
        required: true
    },
    totalDiscount:{
        type: Number,
        default: 0,
    }

},{
    _id: false
})
const paymentSchema = new Schema({
    payment_method: {
        type: String,
        enum: ['cash_payment', 'online_payment'],
        required: true,
        default: 'online_payment'
    },
    payment_status: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    }
}, { _id: false })
const orderSchema = new Schema({
    order_userId:{
        type: Schema.Types.ObjectId,
        ref:'User',
    },
    order_checkout:{
        type: checkOutSchema,
        required: true
    },
    order_payment:{
        type: paymentSchema,
        required: true
    },
    order_product:[{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    order_trackingNumber:{
        type: String,
        default: () => `#${Math.floor(1000000000 + Math.random() * 9000000000)}`
    },
    order_status:{
        type:String,
        enum:['pending', 'confirmed', 'cancelled','delivered'],
        default: 'pending'
    }
},{
    timestamps: true,
    collection: COLLECTION_NAME
})
module.exports = model(DOCUMENT_NAME, orderSchema)