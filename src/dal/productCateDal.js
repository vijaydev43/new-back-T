
const productCateDal = new Object()
const productCateModel = require('../model/productCateModel')

productCateDal.addCategory = async (req) => {
    try {
        let payload = new productCateModel(req)
        let result = await payload.save()
        if (result) {
            return { status: true, message: "Product Category Added", data: result}
        }
        return { status: false, message: "Failed to Add Category", data: result}
    } catch (err) {
        return { status: false, data: err?.message ? err.message : err}
    }
}

productCateDal.getCategory = async (req) => {
    try {
        let query = [{deleted: false}]
        if (req?.status) {
            query.push({ status: req?.status });
          }
          if (req?.productType) {
            query.push({ productType: req?.productType });
          }
        let result = await productCateModel.find({ $and: query}).exec()
        if (result.length){
            return {status: true, message: "Product Category Details", data: result}
        }
        return {status: false, message: "No Categories Found", data: result}
    } catch (err) {
        return { status: false, data: err?.message ? err.message : err}
    }
}

productCateDal.updateCategory = async (req) => {
    try {
        let result = await productCateModel.findOneAndUpdate({ _id: req?.productCateId }, req, { new: true}).exec();
        if (result) {
          return { status: true, message: "Product Category Details Updated", data: result };
        }
        return { status: false, message: "Failed to Update Category Details", data: {} };
    } catch (err) {
        return {status: false, data: err?.message ? err.message : err}
    }
}

productCateDal.deleteCategory = async (id) => {
    try{
        let payload = {
            deleted: true,
          }
          const find = { _id: id }
          const set = { $set: payload }
          const options = { upsert: false, new: true }
        
          let result = await productCateModel.findOneAndUpdate(find, set, options).exec();
          if (result) {
            return { status: true, message: "Product Category Deleted", data: {} }
          }
          return { status: false, message: "Failed to Delete Category", data: {} }
    } catch (err) {
        return { status: false, data: err?.message ? err.message : err}
    }
}
module.exports = productCateDal
