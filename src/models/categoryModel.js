const {model, Schema} = require('mongoose')
const DOCUMENT_NAME = 'Category'
const COLLECTION_NAME = 'Categories'
const categoryShema = new Schema({
    meals:{
        type: String,
        required: true,
    },
    draft:{
        type: Boolean,
        default: true
    },
    publish:{
        type: Boolean,
        default: false
    },
    isDelete:{
        type: Boolean,
        default: false
    },
    shop_id:{
        type: Schema.Types.ObjectId,
        ref:'Shop'
    }
},{
    timestamps: true,
    collection: COLLECTION_NAME
})
module.exports = model(DOCUMENT_NAME, categoryShema)