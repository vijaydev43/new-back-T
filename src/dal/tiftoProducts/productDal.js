const productDal = new Object()
const productModel = require("../../model/tiftoProducts/productModel")

productDal.addProduct = async (req) => {
    try {
      let payload = new productModel(req);
      let result = await payload.save();
      if (result) {
        return { status: true, message: "product  Added Successfully", data: result };
      }
      return { status: false, message: "Failed to Add Food", data: {} };
    } catch (err) {
      return { status: false, data: err?.message ? err.message : err }
    }
}

productDal.getProducts = async (req) => {
    try {
      let query = [{ deleted: false }]
      let result = await productModel.find({ $and: query }).exec()
      if (result.length) {
        return { status: true, message: "Product Details", data: result }
      }
      return { status: false, message: "No Categories Found", data: result }
    } catch (err) {
      return { status: false, data: err?.message ? err.message : err }
    }
}


productDal.updateProducts = async (req) => {
    try {
      let result = await productModel.findOneAndUpdate({ _id: req?.foodId }, req, { new: true }).exec();
      if (result) {
        return { status: true, message: "Food Details Updated", data: result };
      }
      return { status: false, message: "Failed to Update Food Details", data: {} };
    }
    catch (err) {
      return { status: false, data: err?.message ? err.message : err }
    }
} 

productDal.deleteProducts = async (id) => {
    try {
      let payload = {
        deleted: true,
      }
      const find = { _id: id }
      const set = { $set: payload }
      const options = { upsert: false, new: true }
  
      let result = await productModel.findOneAndUpdate(find, set, options).exec();
      if (result) {
        return { status: true, message: "Food Deleted", data: {} }
      }
      return { status: false, message: "Failed to Delete Food", data: {} }
    } catch (err) {
      return { status: false, data: err.message ? err.message : err };
    }
}  


module.exports = productDal  