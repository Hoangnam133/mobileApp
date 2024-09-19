const userModel = require('../models/userModel')
const findByEmail = async(email)=>{
    return await userModel.findOne({email})
}
const findById = async(id)=>{
    return await userModel.findById(id)
}
module.exports = {
    findByEmail,
    findById
}