const authHelper = new Object()
const adminAuthModel = require('../model/adminAuthModel')

authHelper.generateUniqueUserCode1 = async (length) => {
    try {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = "";
        let isUnique = false;

        // while (!isUnique) {
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                code += characters.charAt(randomIndex);
            }
            // const existingRestaurant = adminAuthModel.findOne({ userCode: code });
            // console.log("Check",existingRestaurant)
            // if (!existingRestaurant) {
            //     isUnique = true;
            // }
       // }
        return code;
    } catch (err) {
        console.log('Error Generate Restaurant Code', err)
    }
}

authHelper.generateUniqueUserCode = async (periodNumber,currentDate) => {
    try {
      let query =[{deleted: false }]
      const lastUser = await adminAuthModel
        .find({ $and: query})
        .sort({ _id: -1 })
        .limit(1)
        .exec()
      let userCode = 1;
      if (lastUser.length > 0) {
        userCode = +(lastUser[0].userCode) + 1;
      }
      const formatteduserCode = userCode.toString().padStart(3, "0");
      return formatteduserCode;
    } catch (error) {
      console.error("Error getting order number:", error);
      return "001"; 
    }
  };

module.exports = authHelper