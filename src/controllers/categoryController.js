const categoryService = require('../services/categoryService')
const {SuccessResponse} = require('../core/successResponse')

class CategoryController{
    createCategory = async(req, res, next)=>{
        new SuccessResponse({
            message: 'create category success',
            metaData: await categoryService.createCategory({
                user: req.user,
                ...req.body
            })
        }).send(res)
    }
    deleteCategory = async(req, res, next)=>{
        new SuccessResponse({
            message: 'delete category fail',
            metaData: await categoryService.deleteCategory(req.params.id_type)
        })
    }
    publishCategory = async(req, res, next)=>{
        new SuccessResponse({
            message: 'publish category success',
            metaData: await categoryService.publishCategory(req.params.id_type)
        }).send(res)
    }
    showAllUnpublishCategories = async(req, res, next)=>{
        new SuccessResponse({
            message: 'show list unpublish category success',
            metaData: await categoryService.showAllUnpublishCategories(req.user)
        }).send(res)
    }
    showAllPublishCategories = async(req, res, next)=>{
        new SuccessResponse({
            message: 'show list publish category success',
            metaData: await categoryService.showAllPublishCategories(req.user)
        }).send(res)
    }
    showAllDeletedCategories = async(req, res, next)=>{
        new SuccessResponse({
            message: 'show list deleted category success',
            metaData: await categoryService.showAllDeletedCategories(req.user)
        }).send(res)
    }
    
    

}
module.exports = new CategoryController()