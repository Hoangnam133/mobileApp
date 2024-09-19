const {getSelectData, unGetSelectData} = require('../utils/index')
const productModel = require('../models/productModel')
const subCategoryModel = require('../models/subCategory')
const categoryModel = require('../models/categoryModel')
const {BadRequestError, NotFoundError} = require('../core/errorResponse')
const {removeUndefinedObject} = require('../utils/index')
const createProduct = async({body})=>{
    const {product_name, product_thumb,
        product_description, product_price, ingredients, serving_size
        , subCategory_id, product_ratingAverage, isDraft = true, isPublished = false,
        preparation_time, product_usage} = body
        const foundSubCategory = await subCategoryModel.find({
            _id: subCategory_id,
            publish: true
        })
        if(!foundSubCategory){
            throw new NotFoundError('not found Sub Category')
        }
        const newProduct = await productModel.create({
            product_name,
            product_thumb,
            product_description,
            product_price,
            product_ratingAverage,
            product_usage,
            product_thumb,
            isDraft,
            isPublished,
            preparation_time,
            subCategory_id,
            serving_size,
            ingredients
        })
    return newProduct
}
const findAllProduct = async({limit, sort, page, filter})=>{
    const skip = (page - 1)*limit
    const sortBy  = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const products = await productModel.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .lean()
    if(!products){
        throw new NotFoundError(' not found products')
    }
    return products
}
const findProductsBySubCategory = async ({ subCategory_id, limit, page }) => {
    const skip = (page - 1) * limit
    const products = await productModel.find({ subCategory_id })
        .skip(skip)
        .limit(limit)
        .lean()
    if(!products){
        throw new NotFoundError(' not found products')
    }
    return products
}
const findDraftProducts = async ({ limit , page }) => {
    const skip = (page - 1) * limit
    const products = await productModel.find({ isDraft: true })
        .skip(skip)
        .limit(limit)
        .lean()
    if(!products){
        throw new NotFoundError(' not found products')
    }
    return products
}
const findPublishedProducts = async ({ limit , page  }) => {
    const skip = (page - 1) * limit;
    const products = await productModel.find({ isPublished: true })
        .skip(skip)
        .limit(limit)
        .lean()
    if(!products){
        throw new NotFoundError(' not found products')
    }
    return products
}
const findDeletedProducts = async ({ limit , page  }) => {
    const skip = (page - 1) * limit;
    const products = await productModel.find({ isDeleted: true })
        .skip(skip)
        .limit(limit)
        .lean()
    if(!products){
        throw new NotFoundError(' not found products')
    }
    return products
}
const findProductsByLargeCategory = async ({Category_id, limit, page}) => {
    const largeCategory = await categoryModel.findOne({ _id: Category_id, publish: true }).lean()
    if (!largeCategory) {
        throw new NotFoundError('not found caterogry')
    }
    const subCategories = await categoryModel.find({ parentCategory: largeCategory._id, publish: true }).lean()
    const subCategoryIds = subCategories.map(cat => cat._id)
    const skip = (page - 1) * limit;
    const products = await productModel.find({ subCategory_id: { $in: subCategoryIds } })
        .skip(skip)
        .limit(limit)
        .lean();
    if(!products){
        throw new NotFoundError(' not found products')
    }
    return products
}
const updateProduct = async({productId, updateData})=>{
    const cleanDateBeforeUpdate = removeUndefinedObject(updateData)
    const updateProduct = await productModel.findByIdAndUpdate(productId, cleanDateBeforeUpdate,{
        new: true,
        lean: true,
        //runValidators: true
    })
    if (!updateProduct) {
        throw new NotFoundError('Product not found');
    }
    return updateProduct
}
const updatePublishProduct = async(product_id)=>{
    const updateProduct = await productModel.findByIdAndUpdate(product_id,{
        $set:{
            isPublished: true
        }
    },{
        new: true,
        lean: true
    })
    if (!updateProduct) {
        throw new NotFoundError('Product not found')
    }
    return updateProduct
}
const updateDeleteProduct = async(product_id)=>{
    const updateProduct = await productModel.findByIdAndUpdate(product_id,{
        $set:{
            isDelete: true
        }
    },{
        new: true,
        lean: true
    })
    if (!updateProduct) {
        throw new NotFoundError('Product not found')
    }
    return updateProduct
}
const searchProductByUser = async({keySearch})=>{
    const results = await productModel.find({
        isPublished: true,
        isDelete: false,
        isDraft: false,
        $text:{
            $search: keySearch
        }
    },{
        score: {$meta: 'textScore'}
    }).sort({score: {$meta: 'textScore'}}).lean()
    if (!results) {
        throw new NotFoundError('Product not found')
    }
    return results
}
const getProductById = async(product_id)=>{
    return await productModel.findById(product_id)
}
module.exports = {
   createProduct,
   getProductById,
   updateProduct,
   updateDeleteProduct,
   updatePublishProduct,
   findAllProduct,
   findDeletedProducts,
   findDraftProducts,
   findProductsByLargeCategory,
   findProductsBySubCategory,
   findPublishedProducts,
   searchProductByUser

}