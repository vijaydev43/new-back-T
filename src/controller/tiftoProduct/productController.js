const productController = new Object()
const productDal = require("../../dal/tiftoProducts/productDal")
const appHelper = require('../../helper/helper')

productController.addProduct = async (req) => {
    try {
        let body = req?.body ? req?.body : undefined
        if(body?.isCombo == true){
            body["subCategoryId"]=null
        }
        body["productId"]=await appHelper.generateProductCode()
        let food = await productDal.addProduct(body)
        if (food.status) {
            return appHelper.apiResponse(200, true, food.message, food.data);
        }
        return appHelper.apiResponse(400, false, food.message, food.data);
    } catch (err) {
        console.error("Error in addProduct:", err);
        return appHelper.apiResponse(500, false, err?.message || "Internal Server Error");
    }
};



productController.getproducts = async (req) => {
    try {
        let food = await productDal.getProducts(req?.query)
        if (food.status) {
            return appHelper.apiResponse(200, true, food.message, food.data)
        }
        return appHelper.apiResponse(400, false, food.message, food.data)
    } catch (err) {
        return appHelper.apiResponse(500, false, err?.message ? err.message : 'Internal Server Error')
    }
}

productController.updateProducts = async (req) => {
    try {
        let body = req?.body ? req.body : undefined
        let foods = await productDal.updateProducts(body)
        if (foods.status) {
            return appHelper.apiResponse(200, true, foods.message, foods.data)
        }
        return appHelper.apiResponse(400, false, foods.message, {})
    } catch (err) {
        return appHelper.apiResponse(500, false, err?.message ? err.message : "Internal Server Error")
    }
}

productController.deleteProducts = async (req) => {
    try {
        let id = req?.body?.foodId ? req.body.foodId : undefined
        let foods = await productDal.deleteProducts(id)
        console.log(foods)
        if (foods.status) {
            return appHelper.apiResponse(200, true, foods.message, foods.data)
        }
        return appHelper.apiResponse(400, false, foods.message, {})
    } catch (err) {
        return appHelper.apiResponse(500, false, err?.message ? err.message : "Internal Server Error")
    }
}

module.exports = productController