const orderModel = require('../models/orderModel')
const cartModel = require('../models/cartModel')
const productModel = require('../models/productModel')
const discountModel = require('../models/discountModel')
const { NotFoundError, BadRequestError } = require('../core/errorResponse')
class OrderService{
    /*
        name: inf_user_checkout
        {
            "order_userId": "64c8b5f2d15a3b4d8f4f5b4a",
            "order_checkout": {
            "totalAmount": 120.50,
            "totalDiscount": 10.00
        },
        name: payment_method_detail

            "order_payment": {
            "payment_method": "online_payment",
            "payment_status": "paid"
            },
        name: detail_order
        "order_product": [
            {
                "productId": "64c8b5f2d15a3b4d8f4f5b5b",
                "quantity": 2,
                "price": 30.00
            },
            {
                "productId": "64c8b5f2d15a3b4d8f4f5b6c",
                "quantity": 1,
                "price": 60.50
            }
        ],
        "order_trackingNumber": "#1234567890",
        "order_status": "confirmed",
    }

    */
    static async checkOutReview(user,discount_code ,product_ids=[]){
   
        if(!user){
            throw new BadRequestError('missdata user')
        }
        const findCartByUser = await cartModel.findOne({
            cart_userId: user._id
        }).lean()
        if(!findCartByUser){
            throw new NotFoundError('not found cart by userId')
        }
        if(product_ids.length === null){
            throw new BadRequestError(' please ...')
        }
        const checkout_order = {
            totalPrice: 0,
            totalDiscount: 0,
            totalCheckOut: 0,
        }
        let totalAmount = 0, totalDiscount = 0, orderProducts = [], discountDetails = []
        /* 
            step 1: vòng for duyệt qua từng product_ids, sau đó kiểm tra sản phẩm đó trong csdc.
            step 2: kiểm tra mã giảm giá nếu không có mã thì tính tiền như bình thường,
                trường hợp có mã giảm giá truyền vào thì phải kiểm tra xem mã giảm giá này thuộc loại nào,
                giả sử nó thuộc loại áp dụng vào tổng tiền đơn hàng đơn hàng có giá trị trên 200k thì được
                giảm 15%, hoặc là loại áp dụng vào những sản phẩm cụ thể, đối với trường hợp được áp dụng cho
                các sản phẩm cụ thể ví dụ phở, bún thì người dùng 
        */
    }
    
}