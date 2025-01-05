const categoryDal = require('../../dal/tiftoProducts/categoryDal')
const categoryController = new Object()
const apiResponse = require('../../helper/apiResponse')

categoryController.addCategory = async(req)=>{
    try {
        let body = req?.body ? req.body : undefined
        if(!body.productCateId){
            return new apiResponse(400,true,"Product Category Id is required")
        }
        let category = await categoryDal.addCategory(body)
        if (category.status) {
            return new apiResponse(200, true, category.message, category.data)
        }
        return new apiResponse(400, false, category.message, {})
    }catch(err) {
        return new apiResponse(500, false, err?.message ? err.message : "Internal Server Error")
    }
}

categoryController.getCategory = async (req) => {
    try {
        let category = await categoryDal.getCategory(req?.query)
        if (category.status) {
            return new apiResponse(200, true, category.message, category.data)
        }
        return new apiResponse(400, false, category.message, category.data)
    } catch (err) {
        return new apiResponse(500, false, err?.message ?  err.message : 'Internal Server Error')
    }
}

categoryController.getCategoryById = async (req) => {
    try {
        let category = await categoryDal.getCategoryById(req?.params)
        if (category.status) {
            return new apiResponse(200, true, category.message, category.data)
        }
        return new apiResponse(400, false, category.message, category.data)
    } catch (err) {
        return new apiResponse(500, false, err?.message ?  err.message : 'Internal Server Error')
    }
}

categoryController.updateCategory = async (req) => {
    try {
        let body = req?.body ? req.body : undefined
        let category = await categoryDal.updateCategory(body)
        if (category.status){
            return new apiResponse(200, true, category.message, category.data)
        }
        return new apiResponse(400, false, category.message, {})
    } catch (err) {
        return new apiResponse(500, false, err?.message ? err.message : 'Internal Server Error')
    }
}

categoryController.deleteCategory = async (req) => {
    try {
        let id = req?.body?.categoryId ? req.body.categoryId : undefined
        console.log("id",id)
        let category = await categoryDal.deleteCategory(id)
        if (category.status){
            return new apiResponse(200, true, category.message, category.data)
        }
        return new apiResponse(400, false, category.message, {})
    } catch (err) {
        return new apiResponse(500, false, err?.message ? err.message : 'Internal Server Error')
    }
}

module.exports = categoryController