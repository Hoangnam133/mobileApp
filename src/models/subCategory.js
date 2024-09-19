const {model, Schema} = require('mongoose')
const DOCUMENT_NAME = 'subCategory'
const COLLECTION_NAME = 'subCategories'
const subCategoryShema = new Schema({
    sc_name:{
        type: String,
        required: true,
        unique: true
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
    parentCategory:{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
},{
    timestamps: true,
    collection: COLLECTION_NAME
})
module.exports = model(DOCUMENT_NAME, subCategoryShema)