const fileDal  = new Object()
const fileModel = require("../model/fileModel")

fileDal.createFile = async (data) => {
    try {
      let payload = new fileModel(data);
      let result = await payload.save();
      if (result) {
        return { status: true, data: result };
      }
      return { status: false, data: result }
    } catch (error) {
      return { status: false, data: error.message ? error.message : error }
    }
  
  }
fileDal.getDocumentById = async (id) => {
    try {
     let result = await fileModel.findOne({ _id: id })
      .exec();
      if (result) {
        let response = {
          data: result,
          totalCount: result?.length ? result.length : 0,
        }
        return { status: true, message: "File fetched successfully", data: response }
      } else {
        return { status: false, message: "No File Found", data: [] }
      }
  
    } catch (error) {
      return { status: false, data: error.message ? error.message : error }
    }
  }
fileDal.findAllBanner = async (req) => {
    try {
      let queryArray = [{ deleted: false }];
      let result = await fileModel.find({ $and: queryArray })
      .exec();
      if (result) {
        let response = {
          data: result,
          totalCount: result?.length ? result.length : 0
        }
        return { status: true, message: "File fetched successfully", data: response }
      } else {
        return { status: false, message: "No File Found", data: [] }
      }
  
    } catch (error) {
      return { status: false, data: error.message ? error.message : error }
    }
  }
  
module.exports = fileDal;