const AWS = require('aws-sdk')
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const fs = require('fs')

let s3Data = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID ? process.env.AWS_ACCESS_KEY_ID : "AKIAYLZZJ733MYA37TEQ",
  secretAccessKey: process.env.AWS_SECRET_KEY ? process.env.AWS_SECRET_KEY : "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",
  region: process.env.AWS_REGION ? process.env.AWS_REGION : "ap-south-1"
});

module.exports = {
  uploadDoc: async (file) => {
    try {
      const fileContent = fs.readFileSync(file.path);
      const params = {
        Bucket: process?.env?.AWS_BUCKET_NAME ? process.env.AWS_BUCKET_NAME : "dummybucketz",
        ContentType: file.mimetype,
        Key: `${Date.now()}-${file.originalname}`,
        Body: fileContent,
        gzip: true,
      };
      // To upload file
      let result = await s3Data.upload(params).promise();
      fs.unlinkSync(file.path);
      if (result) {
        return {
          status: true,
          code: 200,
          message: "File Uploaded successfully",
          data: result,
        };
      }
      return {
        status: false,
        code: 400,
        message: "Failed to uplaod",
        data: {},
      };
    } catch (error) {
      return {
        status: false,
        code: 500,
        message: "Failed to uplaod",
        data: error.message ? error.message : "Internal server error",
      };
    }
  },

 downloadFile : async (file) => {
    try {
      const result = await s3Data
                        .getObject({ Bucket: "dummybucketz", Key: file })
                        .promise();
      let base64String = Buffer.from(result.Body).toString("base64");
      if (result) {
        return { status: true,code: 200, message: "File Fetched Successfully", data: { fileData: base64String, contentType: result?.ContentType } };
      }
      return { status: false,code: 400,message: "Failed to fetch FileData",data: {} };
    } catch (any) {
      console.log("errr", any)
      return { status: false,code: 500,message: "Failed to Fetch File",data: error.message ? error.message : "Internal server error" };
    }
  }
}