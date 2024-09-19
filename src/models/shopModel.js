const { Schema, model } = require('mongoose')
const COLLECTION_NAME = 'Shops'
const DOCUMENT_NAME = 'Shop'
const shopSchema = new Schema({
    shop_name: {
        type: String,
        trim: true,
        maxLength: 150
    },
    shop_location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    shop_owner:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    shop_image:{
        type: String,
        require: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, shopSchema)
