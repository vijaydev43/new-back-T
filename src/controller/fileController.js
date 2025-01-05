const fileController = new Object();
const fileDal = require("../dal/fileDal")
const fileHelper = require("../helper/fileHelper")
const appHelper = require("../helper/helper")
const userDal = require("../dal/userAuthDal")

fileController.createFile = async (req) => {
    try {
      let fileUpload = await fileHelper.uploadDoc(req.file);
      if (!fileUpload.status) {
        return appHelper.apiResponse(400, false, "Failed to upload file", {})
      }
      //let fetchFile = await fileHelper.downloadFile(req.file.originalname);
      let payload = {
        imgUrl: fileUpload?.data?.Location ? fileUpload.data.Location : "",
        name: req?.file?.originalname ? req.file.originalname : "",
        mimeType: req?.file?.mimetype ? req.file.mimetype : "",
        file:"",
        //file:fetchFile?.data?.fileData
      }
      let result = await fileDal.createFile(payload);
      if (result.status) {
        if (req?.params?.userId && result?.data?.imgUrl) {
          await userDal.updateUserById(req?.params?.userId, { imgUrl: result?.data?.imgUrl })
        }
        return appHelper.apiResponse(200, true, "File saved successfully", result.data);
      }
      return appHelper.apiResponse(400, false, "Failed to save file", {});
    } catch (error) {
      return appHelper.apiResponse(500, false, error.message ? error.message : "Internal server error");
    }   
}

module.exports = fileController;  