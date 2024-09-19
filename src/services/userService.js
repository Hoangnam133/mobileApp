const userModel = require('../models/userModel')
const dotenv = require('dotenv')
dotenv.config()
const keyTokenService = require('../services/keyTokenService')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const {findByEmail, findById} = require('../repositories/userRepository')
const {BadRequestError, NotFoundError, Unauthorized} = require('../core/errorResponse')
const {createTokenPair} = require('../auth/authUtils')
const { getInfoData } = require('../utils')
class UserService{
    static login = async({email, password, refreshToken = null})=>{
        const checkUser = await findByEmail(email)
        if(!checkUser){
            throw new NotFoundError('user not found')
        }
     
        const matchPassword = await bcrypt.compare(password, checkUser.password)
        if(!matchPassword){
            throw new NotFoundError('user not found')
        }
        const publicKey = process.env.PUBLIC_KEY
        const privateKey = process.env.PRIVATE_KEY
        console.log(`private::: ${privateKey}, puplickey:::${publicKey}`)
        const token = await createTokenPair({userId: checkUser._id, roles: checkUser.roles}, publicKey, privateKey)
        if(!token){
            throw new BadRequestError('create token fail')
        }
        const keyToken = await keyTokenService.createKeyToken({
            userId: checkUser._id,
            publicKey,
            privateKey,
            refreshToken: token.refreshToken
        })
        if(!keyToken) throw new BadRequestError('create key token error')
        return{
            user: getInfoData({fileds:['_id','email','name'], object: checkUser}),
            token: token
        }
    }
    static signUp = async({name, email, password})=>{
        const checkUser = await findByEmail(email)
        if(checkUser){
            throw new BadRequestError('email already registed')
        }
        const hashPassword = await bcrypt.hash(password,10)
        const createUser = await userModel.create({
            name, email, password: hashPassword, roles: 'USER'
        })
        if(createUser){
            const publicKey = process.env.PUBLIC_KEY
            const privateKey = process.env.PRIVATE_KEY
            console.log(`privateKey ::: ${privateKey}, puplicKey:::: ${publicKey}`)
            const token = await createTokenPair({userId: createUser._id, roles: createUser.roles}, publicKey, privateKey)
            if(!token){
                throw new BadRequestError('create token fail')
            }
            console.log(`token::: ${token}`)
            const keyToken = await keyTokenService.createKeyToken({
                userId: createUser._id,
                publicKey,
                privateKey,
                refreshToken: token.refreshToken
            })
            if(!keyToken) throw new BadRequestError('create key token error')
            return{
                user: getInfoData({fileds:['_id','email','name'], object: createUser}),
                token: token
            }
        }
    }
    static logout = async (keyStore)=>{
        const delKey = await keyTokenService.removeKeyById(keyStore._id)
        console.log(delKey)
        return delKey
    }
    static handlerRefreshToken = async({keyStore, refreshToken, userId})=>{
        if(!keyStore) throw new NotFoundError('not found keyStore')
        if(keyStore.refreshTokensUsed.includes(refreshToken)){
            await keyTokenService.deleteKeyById(userId)
            throw new BadRequestError('refreshToken already used please login again')
        }
        if(keyStore.refreshToken !== refreshToken){
            throw new Unauthorized('refresh token invalid')
        }
        const existingUser = await findById(userId)
        if(!existingUser){
            throw new NotFoundError('user not found')
        }
        const token = await createTokenPair({userId: existingUser._id, roles: existingUser.roles}
            ,process.env.PUBLIC_KEY, process.env.PRIVATE_KEY)
        await keyTokenService.updateKeyToken(keyStore._id,{
            $set:{
                refreshToken: token.refreshToken
            },
            $addToSet:{
                refreshTokensUsed: refreshToken
            }
        })
        return{
            user: getInfoData({fileds:['_id','email','name'], object: existingUser}),
            token: token
        }
    }
}
module.exports = UserService