const { BadRequestError, NotFoundError } = require('../core/errorResponse')
const categoryModel = require('../models/categoryModel')
const shopModel = require('../models/shopModel')
const subCategoryModel = require('../models/subCategory.js')
const { getInfoData } = require('../utils')
class CategoryService{
    static createCategory = async({user,meals})=>{
        if(!user){
            throw new BadRequestError('not found user')
        }
        const foundShop = await shopModel.findOne({shop_owner: user._id})
        if(!foundShop) throw new NotFoundError('not found shop')
        const newCategory =  await categoryModel.create({
            meals,
            shop_id: foundShop._id
        })
        return{
            category: getInfoData({fileds:['meals'],object: newCategory})
        }
    }
    static showAllUnpublishCategories = async(user)=>{
        if(!user){
            throw new BadRequestError('not found user')
        }
        const foundShop = await shopModel.findOne({shop_owner: user._id})
        if(!foundShop) throw new NotFoundError('not found shop')
        const listUnpublish = await categoryModel.find({
            draft: true,
            isDelete: false,
            publish: false
        })
        return listUnpublish

    }
    static showAllPublishCategories = async(user)=>{
        const listpublish = await categoryModel.find({
            draft: false,
            isDelete: false,
            publish: true
        })
        return listpublish

    }
    static showAllDeletedCategories = async(user)=>{
        if(!user){
            throw new BadRequestError('not found user')
        }
        const foundShop = await shopModel.findOne({shop_owner: user._id})
        if(!foundShop) throw new NotFoundError('not found shop')
        const deletedList = await categoryModel.find({
            draft: true,
            isDelete: true,
            publish: false
        })
        return deletedList
    }
    static deleteCategory = async(id_type)=>{
        const findSubCategory = await subCategoryModel.find({
            parentCategory: id_type
        })
        if(!findSubCategory){
            throw new NotFoundError('not found subCategory');
        }
        const deleteCategory = await categoryModel.updateOne({
            _id: id_type
        }, {isDelete: true})
        if(!deleteCategory){
            throw new BadRequestError('delete category fail');
        }
        return {
            message: 'delete category success'
        }
    }
    static publishCategory = async(id_type)=>{
        const updateCategory = await categoryModel.findByIdAndUpdate(id_type,{
            $set: {
                draft: false,
                publish: true
            }
        },{
            new: true
        })
        if(!updateCategory){
            throw new BadRequestError('update fail')
        }
        return updateCategory
    }
}
module.exports = CategoryService