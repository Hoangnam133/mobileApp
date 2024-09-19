const {Schema, model, Types} = require('mongoose')
const slugify = require('slugify')
const COLLECTION_NAME = 'Products'
const DOCUMENT_NAME = 'Product'
const productSchema = new Schema({
    product_name:{
        type: String,
        required: true,
    },
    product_thumb:{
        type: String,
        required: true
    },
    product_description:{
        type: String,
        required: true
    },
    product_price:{
        type: Number,
        required: true
    },
    ingredients:{
        type: String,
        required: true
    },
    serving_size:{
        type: String,
        required: true
    },
    subCategory_id:{
        type: Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: true 
    },
    product_slug:{
        type: String,
        unique: true
    },
    product_ratingAverage:{
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'rating must be above 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    isDraft:{
        type: Boolean,
        default: true,
        index: true,
        select: false
    },
    isPublished:{
        type: Boolean,
        default: false,
        index: true,
        select: false
    },
    isDelete:{
        type: Boolean,
        default: false,
        index: true,
        select: false
    },
    preparation_time:{
        type: Number,
        required: true
    },
    product_usage: {
        type: String, 
        required: true,
    }
},{
    timestamps: true,
    collection: COLLECTION_NAME
})
productSchema.pre('save', function(next){
    this.product_slug = slugify(this.product_name,{lower: true})
    next()
})
productSchema.index({product_name: 'text', product_description: 'text'})
module.exports = model(DOCUMENT_NAME, productSchema)