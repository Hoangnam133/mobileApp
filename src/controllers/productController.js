const productService = require('../services/productService')
const {SuccessResponse} = require('../core/successResponse')
class ProductController {
    createProduct = async(req, res, next)=>{
        new SuccessResponse({
            message: 'create product success',
            metaData: await productService.createProduct(req.body)
        }).send(res)
    }
    findProductById = async(req, res, next)=>{
        const productId = req.params.product_id.trim(); // Loại bỏ ký tự newline hoặc khoảng trắng
        if (!/^[0-9a-fA-F]{24}$/.test(productId)) {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }
        new SuccessResponse({
            message: 'create product success',
            metaData: await productService.findProductById(
                productId
            )
        }).send(res)
    }
    updateProduct = async(req, res, next)=>{
        new SuccessResponse({
            message: 'update product success',
            metaData: await productService.updateProduct({
                productId: req.params.productId,
                updateData: req.body
            })
        })
    }
    deleteProduct = async(req, res, next)=>{
        new SuccessResponse({
            message: 'delete product success',
            metaData: await productService.updateDeleteProduct(req.params.product_Id)
        })
    }
    publishProduct = async(req, res, next)=>{
        new SuccessResponse({
            message: 'publish product success',
            metaData: await productService.updatePublishProduct(req.params.product_Id)
        })
    }
    findAllProduct = async(req, res, next)=>{
        new SuccessResponse({
            message: 'get list product success',
            metaData: await productService.findAllProduct({ limit, sort, page})
        })
    }
    findDeletedProducts = async(req, res, next)=>{
        new SuccessResponse({
            message: 'get list deleted product success',
            metaData: await productService.findDeletedProducts({ limit, sort})
        })
    }
    findDraftProducts = async(req, res, next)=>{
        new SuccessResponse({
            message: 'get list draft product success',
            metaData: await productService.findDraftProducts({ limit, sort})
        })
    }
    findProductsByLargeCategory = async(req, res, next)=>{
        new SuccessResponse({
            message: 'get list product by category success',
            metaData: await productService.findProductsByLargeCategory({
                limit, page, Category_id: req.params.Category_id
            })
        })
    }
    findProductsBySubCategory = async(req, res, next)=>{
        new SuccessResponse({
            message: 'get list product by category success',
            metaData: await productService.findProductsBySubCategory({
                limit, page, subCategory_id: req.params.subCategory_id
            })
        })
    }
    searchProductByUser = async(req, res, next)=>{
        new SuccessResponse({
            message: 'search product success',
            metaData: await productService.searchProductByUser(req.params)
        })
    }
}
module.exports = new ProductController()