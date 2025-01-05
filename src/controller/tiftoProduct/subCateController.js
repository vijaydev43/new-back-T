const subCateController = new Object()
const subCateDal = require("../../dal/tiftoProducts/subCateDal")
const apiResponse = require('../../helper/apiResponse')

subCateController.addCategory = async(req)=>{
    try {
        let body = req?.body ? req.body : undefined
        if(!body.productCateId){
            return new apiResponse(400,true,"Product Category Id is required")
        }
        let category = await subCateDal.addCategory(body)
        if (category.status) {
            return new apiResponse(200, true, category.message, category.data)
        }
        return new apiResponse(400, false, category.message, {})
    }catch(err) {
        return new apiResponse(500, false, err?.message ? err.message : "Internal Server Error")
    }
}

subCateController.getCategory = async (req) => {
    try {
        let category = await subCateDal.getCategory(req?.query)
        if (category.status) {
            return new apiResponse(200, true, category.message, category.data)
        }
        return new apiResponse(400, false, category.message, category.data)
    } catch (err) {
        return new apiResponse(500, false, err?.message ?  err.message : 'Internal Server Error')
    }
}

subCateController.updateCategory = async (req) => {
    try {
        let body = req?.body ? req.body : undefined
        let category = await subCateDal.updateCategory(body)
        if (category.status){
            return new apiResponse(200, true, category.message, category.data)
        }
        return new apiResponse(400, false, category.message, {})
    } catch (err) {
        return new apiResponse(500, false, err?.message ? err.message : 'Internal Server Error')
    }
}

subCateController.deleteCategory = async (req) => {
    try {
        let id = req?.body?.productCateId ? req.body.productCateId : undefined
        let category = await subCateDal.deleteCategory(id)
        if (category.status){
            return new apiResponse(200, true, category.message, category.data)
        }
        return new apiResponse(400, false, category.message, {})
    } catch (err) {
        return new apiResponse(500, false, err?.message ? err.message : 'Internal Server Error')
    }
}

module.exports = subCateController