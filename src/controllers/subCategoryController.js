const subCategoryService = require('../services/subCategoryService')
const {SuccessResponse} = require('../core/successResponse')

class SubCategoryController{
      // Tạo subcategory mới
      subCreateCategory = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create subCategory success',
            metaData: await subCategoryService.createSubCategory(req.body)
        }).send(res);
    }

    // Hiển thị tất cả subcategories chưa publish
    showAllUnpublishSubCategories = async (req, res, next) => {
        new SuccessResponse({
            message: 'List of unpublished subCategories',
            metaData: await subCategoryService.showAllUnpublishSubCategories(req.user)
        }).send(res);
    }

    // Hiển thị tất cả subcategories đã publish
    showAllPublishSubCategories = async (req, res, next) => {
        new SuccessResponse({
            message: 'List of published subCategories',
            metaData: await subCategoryService.showAllpublishSubCategories()
        }).send(res);
    }

    // Hiển thị tất cả subcategories đã xóa
    showAllDeletedSubCategories = async (req, res, next) => {
        new SuccessResponse({
            message: 'List of deleted subCategories',
            metaData: await subCategoryService.showAllDeletedsSubCategories(req.user)
        }).send(res);
    }

    // Xóa một subcategory
    deleteSubCategory = async (req, res, next) => {
        new SuccessResponse({
            message: 'SubCategory deleted successfully',
            metaData: await subCategoryService.deleteSubCategories(req.user, req.params.subCategory_id)
        }).send(res);
    }

    // Publish một subcategory
    publishSubCategory = async (req, res, next) => {
        new SuccessResponse({
            message: 'SubCategory published successfully',
            metaData: await subCategoryService.publishSubCategories(req.user, req.params.subCategory_id)
        }).send(res);
    }
}
module.exports = new SubCategoryController()