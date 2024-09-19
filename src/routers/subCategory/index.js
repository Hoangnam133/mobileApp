const express = require('express')
const {authentication, authorizeRoles} = require('../../auth/authUtils')
const router = express.Router()

const subCategoryController = require('../../controllers/subCategoryController')
const { asynHandler } = require('../../utils/handler')
router.get('/listPublish', asynHandler(subCategoryController.showAllPublishSubCategories));
router.use(authentication)
router.post('/create', authorizeRoles('ADMIN'),asynHandler(subCategoryController.subCreateCategory))
router.get('/listUnpublish', authorizeRoles('ADMIN'), asynHandler(subCategoryController.showAllUnpublishSubCategories));
router.get('/listDeleted', authorizeRoles('ADMIN'), asynHandler(subCategoryController.showAllDeletedSubCategories));
router.delete('/delete/:subCategory_id', authorizeRoles('ADMIN'), asynHandler(subCategoryController.deleteSubCategory));
router.patch('/publish/:subCategory_id', authorizeRoles('ADMIN'), asynHandler(subCategoryController.publishSubCategory));
module.exports = router
