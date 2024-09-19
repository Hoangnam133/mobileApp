const _ = require('lodash')
const {Types} = require('mongoose')
const convertIoToObjectId = (id)=>{
    return Types.ObjectId(id)
}
const getInfoData = ({fileds = [], object = {}})=>{
    return _.pick(object,fileds)
}
const getSelectData = (select = []) =>{
    return Object.fromEntries(select.map(el => [el, 1]))
}
const unGetSelectData = (data, select = []) => {
    return Object.fromEntries(
        Object.entries(data).filter(([key]) => !select.includes(key))
    )
}
const removeUndefinedObject = obj =>{
    Object.keys(obj).forEach(k =>{
        if(obj[k] == null){
            delete  obj[k]
        }
    })
    return obj
}
const updateNestedObjectParser = obj =>{
    const final = {}
    Object.keys(obj).forEach(k =>{
        if(typeof obj[k] === 'object' && !Array.isArray(obj[k])){
            const response = updateNestedObjectParser(obj[k])
            Object.keys(response).forEach(a =>{
                final[`${k}.${a}`] = response[a]
            })
        }
        else{
            final[k] = obj[k]
        }
    })
    return final
}

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    convertIoToObjectId
}