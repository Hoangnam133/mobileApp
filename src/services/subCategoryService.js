const { BadRequestError, NotFoundError } = require('../core/errorResponse')
const subCategoryModel = require('../models/subCategory')
const shopModel = require('../models/shopModel')
const { getInfoData } = require('../utils')
class SubCategoryService{
    static createSubCategory = async({sc_name, parentCategory})=>{
        const foundCategory = await subCategoryModel.find({
            draft: false,
            isDelete: false,
            publish: true,
            _id: parentCategory
        })
        if(!foundCategory){
            throw new NotFoundError('not found category')
        }
        const newSubCategory =  await subCategoryModel.create({
            sc_name,
            parentCategory
        })
        return{
            SubCategory: getInfoData({fileds:['sc_name'],object: newSubCategory})
        }
    }
    static showAllUnpublishSubCategories = async(user)=>{
        if(!user){
            throw new BadRequestError('not found user')
        }
        const foundShop = await shopModel.findOne({shop_owner: user._id})
        if(!foundShop) throw new NotFoundError('not found shop')
        const listUnPublish = await subCategoryModel.find({
            draft: true,
            isDelete: false,
            publish: false,
        })
        return listUnPublish
    }
    static showAllpublishSubCategories = async()=>{
        const listPublish = await subCategoryModel.find({
            draft: false,
            isDelete: false,
            publish: true,
        })
        return listPublish
    }
    static showAllDeletedsSubCategories = async(user)=>{
        if(!user){
            throw new BadRequestError('not found user')
        }
        const foundShop = await shopModel.findOne({shop_owner: user._id})
        if(!foundShop) throw new NotFoundError('not found shop')
        const listDeleted = await subCategoryModel.find({
            draft: false,
            isDelete: true,
            publish: true,
        })
        return listDeleted
    }
    static deleteSubCategories = async(user, subCategory_id)=>{
        if(!user){
            throw new BadRequestError('not found user')
        }
        const foundShop = await shopModel.findOne({shop_owner: user._id})
        if(!foundShop) throw new NotFoundError('not found shop')
        const deletedSubCategories = await subCategoryModel.findByIdAndUpdate(subCategory_id,{
            isDelete: true
        })
        return deletedSubCategories
    }
    static publishSubCategories = async(user, subCategory_id)=>{
        if(!user){
            throw new BadRequestError('not found user')
        }
        const foundShop = await shopModel.findOne({shop_owner: user._id})
        if(!foundShop) throw new NotFoundError('not found shop')
            const plSubCategories = await subCategoryModel.findByIdAndUpdate(subCategory_id,{
            publish: true
        })
        return plSubCategories
    }
}
module.exports = SubCategoryService