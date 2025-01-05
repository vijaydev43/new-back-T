const addressModel = require("../model/addressModel")
const addressDal = new Object()


addressDal.createAddress = async(req,res)=>{
    try{
        let payload = new addressModel(req)
        let result = await payload.save()
        if(result){
            return {status:true,message:"Address Saved Successfully",data:result}
        }
        return{status:false,message:"Address not Saved!!"}
    }
    catch (err) {
        return{status:false,data:err?.message?err.message:err}
    }
}

addressDal.findAllAdress = async(req)=>{
    try{
        let query =[{deleted:false}]
        let page = req?.offset ? req.offset :0;
        let limit = req?.limit ? req.limit :10;
        let skip = page * limit
        if(req?.value){
            query.push({
                "$or":[
                    {userName:{"$regex":req.value,"$options":"i"}},
                    {city:{"$regex":req.value,"$options":"i"}}
                ]
            })
        }
        if(req?.addressType){
            queryArray.push({ "addressType": req?.addressType })
        }
        if(req?.userId){
            query.push({userId:new Types.ObjectId(req?.userId)})
        }
        let totalCount = await addressModel.find({$and:query}).countDocuments().exec()
        let result = await addressModel.aggregate()
        .match({$and:query})
        // .lookup({from:"userslists",localField:"userId",foreignField:"_id" ,as:"userDetails"})
        // .unwind({path:"$userDetails",preserveNullAndEmptyArrays:true})
        // .project({
        //     _id:1,
        //     houseNo:1,
        //     district:1,
        //     street:1,
        //     fullAddress:1,
        //     city:1,
        //     state:1,
        //     country:1,
        //     postalCode:1,
        //     landMark:1,
        //     contactPerson:1,
        //     contactPersonNumber:1,
        //     addressType:1,
        //     region:1,
        //     userId:"$userDetails._id",
        //     userCode:"$userDetails.uuid",
        //     firstName:"$userDetails.firstName",
        //     lastName:"$userDetails.lastName",
        //     email:"$userDetails.email",
        //     userDetails:1
        // })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .sort({_id:1,createdAt:1})
        .exec()
        let response ={
            totalCount :totalCount,
            fetchCount:result?.length ? result.length:0,
            data:result
        }
        if(result.length){
            return{status:true,message:"Address fetch successFully",data:response}
        }
        return {status:false,message:"Address failed fetched"}
    }
    catch (err){
        return{status:false,data:err?.message?err.message:err}
    }
}

addressDal.findAddressById = async (id) => {
    try {
      let result = await addressModel.find({ _id: id }).exec();
      if (result) {
        return { status: true, data: result }
      }
      return { status: false, data: result }
    } catch (error) {
      return { status: false, data: error.message ? error.message : error }
    }
}
addressDal.updateAddressByAddressId = async (id, data) => {
    try {
      let result = await addressModel.findOneAndUpdate({ _id: id }, data, { new: true }).exec();
      if (result) {
        return { status: true, data: result };
      }
      return { status: false, data: result };
    } catch (error) {
      return { status: false, data: error.message ? error.message : error };
    }
}

addressDal.deleteAddressByAddressId = async (id) => {
    let payload = {
      deleted: true
    }
    const find = { _id: id }
    const set = { $set: payload }
    const options = { upsert: false, new: true }
  
    let result = await addressModel.findOneAndUpdate(find, set, options).exec();
    if (result) {
      return { status: true, data: {} }
    }
    return { status: false, data: result }
}

module.exports = addressDal;