const authModel = require ('../model/authModels/userAuthModels')
const authDal = new Object()

authDal.fetchUserByConsumerAndDeliveryman = async (data) => {
    try {
      let query = [{ deleted: false }];
      if (data?.email) {
        query.push({ email: data?.email })
      }
      if (data?.phoneNo) {
        query.push({ phoneNo: data?.phoneNo })
      } if (data?.role) {
        query.push({ role: data?.role })
  
      }
      let result = await authModel.find({ $and: query }).exec();
      if (result?.length) {
        return { status: true, data: result[0] }
      }
      return { status: false, data: {} }
    } catch (error) {
      return { status: false, data: error.message ? error.message : error }
    }
}

module.exports = authDal
