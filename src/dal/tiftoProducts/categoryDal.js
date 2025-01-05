const categoryModel = require('../../model/tiftoProducts/categoryModel')
const categoryDal = new Object();
const {Types} = require("mongoose")

categoryDal.addCategory = async (req) => {
    try {
        let payload = new categoryModel(req)
        let result = await payload.save()
        if (result) {
            return { status: true, message: "Category Added", data: result}
        }
        return { status: false, message: "Failed to Add Category", data: result}
    } catch (err) {
        return { status: false, data: err?.message ? err.message : err}
    }
}

categoryDal.getCategory = async (req) => {
    try {
        let query = [{deleted: false}]
        let sort = req?.sort ? req.sort : "-createdAt";
        let page = req?.offset ? req.offset : 0; //offset:default:0
        let limit = req?.limit ? req.limit : 10;
        let skip = page * limit
        if (req?.value) {
         query.push({
        "$or": [
          { cateName: { "$regex": req.value, "$options": "i" } },
        //   { foodTitle: { "$regex": req.value, "$options": "i" } },
          //{ "restuarentDetails.name": { "$regex": req.value, "$options": "i" } }
         ]
         })
        }
        if(req?.categoryId){
            query.push({categoryId:new Types.ObjectId(req?.categoryId)})
        }
        if (req?.cateStatus) {
            query.push({ cateStatus: req?.cateStatus });
        }
        if(req?.productCateId){
            query.push({productCateId:req?.productCateId})
        }
        let totalCount = await categoryModel.find({$and:query}).countDocuments().exec()  
        let result = await categoryModel.aggregate()
        .match({$and:query})
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .sort(sort)
        .exec()
        if (result){
            let response = {
                totalCount: totalCount ? totalCount : 0,
                fetchCount: result?.length ? result.length : 0,
                data: result
              }
            return {status: true, message: " Category Details fetched", data: response}
        }
        return {status: false, message: "No Categories Found", data: response}
    } catch (err) {
        return { status: false, data: err?.message ? err.message : err}
    }
}
categoryDal.getCategoryById = async (req) => {
    try {
        let result = await categoryModel.findOne({ _id: new Types.ObjectId(req?.categoryId) }).exec();
        if (result) {
          return { status: true, message: "Product Category Details", data: result };
        }
        return { status: false, message: "Failed to get Category Details", data: {} };
    } catch (err) {
        return {status: false, data: err?.message ? err.message : err}
    }
}

categoryDal.updateCategory = async (req) => {
    try {
        let result = await categoryModel.findOneAndUpdate({ _id: new Types.ObjectId(req?.categoryId) }, req, { new: true}).exec();
        if (result) {
          return { status: true, message: "Product Category Details Updated", data: result };
        }
        return { status: false, message: "Failed to Update Category Details", data: {} };
    } catch (err) {
        return {status: false, data: err?.message ? err.message : err}
    }
}

categoryDal.deleteCategory = async (id) => {
    try{
        let payload = {
            deleted: true,
          }
          const find = { _id: id }
          const set = { $set: payload }
          const options = { upsert: false, new: true }
        
          let result = await categoryModel.findOneAndUpdate(find, set, options).exec();
          if (result) {
            return { status: true, message: "Product Category Deleted", data: {} }
          }
          return { status: false, message: "Failed to Delete Category", data: {} }
    } catch (err) {
        return { status: false, data: err?.message ? err.message : err}
    }
}

module.exports = categoryDal