const subCateDal = new Object()
const subCateModel = require("../../model/tiftoProducts/subCategoryModel")
const { Types } = require("mongoose");


subCateDal.addCategory = async (req) => {
    try {
        let payload = new subCateModel(req)
        let result = await payload.save()
        if (result) {
            return { status: true, message: "Category Added", data: result}
        }
        return { status: false, message: "Failed to Add Category", data: result}
    } catch (err) {
        return { status: false, data: err?.message ? err.message : err}
    }
}

subCateDal.getCategory = async (req) => {
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
            { subCateName: { "$regex": req.value, "$options": "i" } },
          //{ "restuarentDetails.name": { "$regex": req.value, "$options": "i" } }
         ]
         })
        }
        if (req?.subCateStatus) {
            query.push({ subCateStatus: req?.subCateStatus });
          }
        if (req?.categoryId) {
            query.push({ categoryId: new Types.ObjectId(req?.categoryId) });
          }
        if(req?.productCateId){
            query.push({productCateId:new Types.ObjectId(req?.productCateId)})
        }
        console.log("query",query)
        let totalCount = await subCateModel.find({ $and: query}).countDocuments().exec()  
        let result = await subCateModel.aggregate()
        .match({ $and: query})
        .lookup({from:"categories",localField:"categoryId",foreignField:"_id",as:"categoryDetails"})
        .unwind({path: "$categoryDetails", preserveNullAndEmptyArrays: true })
        .project({
            productCateId:1,
            subCateName:1,
            subCateDesc:1,
            subCateImg:1,
            subCateStatus:1,
            categoryId:1,
            _id:1,
            cateName:"$categoryDetails.cateName", 
            cateDesc:"$categoryDetails.cateDesc",
            cateStatus:"$categoryDetails.cateStatus",
        })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .sort(sort)
        .exec()
        let response = {
            totalCount: totalCount,
            fetchCount: result?.length ? result.length : 0,
            data: result
          }
        if (result.length){
            return {status: true, message: "sub Category Details fetched", data: response}
        }
        return {status: false, message: "No sub Categories Found", data: response}
    } catch (err) {
        return { status: false, data: err?.message ? err.message : err}
    }
}

subCateDal.updateCategory = async (req) => {
    try {
        let result = await subCateModel.findOneAndUpdate({ _id: req?.categoryId }, req, { new: true}).exec();
        if (result) {
          return { status: true, message: "Product Category Details Updated", data: result };
        }
        return { status: false, message: "Failed to Update Category Details", data: {} };
    } catch (err) {
        return {status: false, data: err?.message ? err.message : err}
    }
}

subCateDal.deleteCategory = async (id) => {
    try{
        let payload = {
            deleted: true,
          }
          const find = { _id: id }
          const set = { $set: payload }
          const options = { upsert: false, new: true }
        
          let result = await subCateModel.findOneAndUpdate(find, set, options).exec();
          if (result) {
            return { status: true, message: "Product Category Deleted", data: {} }
          }
          return { status: false, message: "Failed to Delete Category", data: {} }
    } catch (err) {
        return { status: false, data: err?.message ? err.message : err}
    }
}

module.exports = subCateDal