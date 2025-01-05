const productCateController = new Object()
const productCateDal = require('../dal/productCateDal')
const apiResponse = require('../helper/apiResponse')

productCateController.addCategory = async(req) => {
    try {
        let body = req?.body ? req.body : undefined
        let category = await productCateDal.addCategory(body)
        if (category.status) {
            return new apiResponse(200, true, category.message, category.data)
        }
        return new apiResponse(400, false, category.message, {})
    }catch(err) {
        return new apiResponse(500, false, err?.message ? err.message : "Internal Server Error")
    }
}

productCateController.getCategory = async (req) => {
    try {
        let category = await productCateDal.getCategory(req?.query)
        if (category.status) {
            return new apiResponse(200, true, category.message, category.data)
        }
        return new apiResponse(400, false, category.message, category.data)
    } catch (err) {
        return new apiResponse(500, false, err?.message ?  err.message : 'Internal Server Error')
    }
}

productCateController.updateCategory = async (req) => {
    try {
        let body = req?.body ? req.body : undefined
        let category = await productCateDal.updateCategory(body)
        if (category.status){
            return new apiResponse(200, true, category.message, category.data)
        }
        return new apiResponse(400, false, category.message, {})
    } catch (err) {
        return new apiResponse(500, false, err?.message ? err.message : 'Internal Server Error')
    }
}

productCateController.deleteCategory = async (req) => {
    try {
        let id = req?.body?.productCateId ? req.body.productCateId : undefined
        let category = await productCateDal.deleteCategory(id)
        if (category.status){
            return new apiResponse(200, true, category.message, category.data)
        }
        return new apiResponse(400, false, category.message, {})
    } catch (err) {
        return new apiResponse(500, false, err?.message ? err.message : 'Internal Server Error')
    }
}

productCateController.categoryList = async (req) => {
    try {
        let category = await productCateDal.categoryList(req?.query)
        if (category.status) {
            return new apiResponse(200, true, category.message, category.data)
        }
        return new apiResponse(400, false, category.message, category.data)
    } catch (err) {
        return new apiResponse(500, false, err?.message ?  err.message : 'Internal Server Error')
    }
}

module.exports = productCateController