const cartDal = new Object()
const cartModel = require('../model/cartModel')
const userDal = require("../dal/userAuthDal")


cartDal.checkCart = async (req) => {
    try {
      let queryArray = [{ deleted: false }];
      if (req?.userId) {
        queryArray.push({ userId: new Types.ObjectId(req?.userId) });
      }
      if (req?.productId) {
        queryArray.push({ productId: new Types.ObjectId(req?.productId) })
      }
      let cart = await cartModel.find({ $and: queryArray }).exec()
      if (cart.length) {
        return {
          status: true,
          message: "cart Details Fetched Successfully",
          data: cart,
        };
      }
      return { status: false, message: "cart Details Not Found", data: cart };
    } catch (err) {
      return { status: false, data: err.message ? err.message : err }
    }
}
  
cartDal.createCart = async (data) => {
    try {
      let payload = new cartModel(data);
      let result = await payload.save();
      if (result) {
        return { status: true, data: result };
      }
      return { status: false, data: result }
    } catch (error) {
      return { status: false, data: error.message ? error.message : error }
    }
}

cartDal.getCartCount = async (req) => {
    try {
      let queryArray = [{ deleted: false }];
      if (req?.userId) {
        queryArray.push({ userId: new Types.ObjectId(req?.userId) });
      }
      const cart = await cartModel.aggregate([
        { $match: { $and: queryArray } },
        {
          $group: {
            _id: null,
            cartQuantity: { $sum: "$quantity" }
          }
        },
        {
          $project: {
            _id: 0
          }
        }
      ]).exec()
  
      return {
        status: true,
        message: "Count Get",
        data: cart[0],
      };
    } catch (err) {
      return { status: false, data: err.message ? err.message : err }
    }
}

cartDal.findAllCart = async(req,res)=>{
    try{
        let query = [{deleted:false}]
        if (req?.userId) {
            queryArray.push({ userId: new Types.ObjectId(req?.userId) });
        }
        if (req?.cartId) {
            queryArray.push({ _id: new Types.ObjectId(req?.cartId) });
        }
        let result = await cartModel.aggregate([],{allowDiskUse:true})
        .match({$and:query})
        .lookup({from:"products",
            let:{ selectedVariantId: "$selectedVariantId", quantity: "$quantity", isCustomized: "$isCustomized" },
            as:"variantDetails",
            pipeline:[
                {
                    $unwind: "$customizedFood.addVariants"
                  },
                  {
                    $unwind: "$customizedFood.addVariants.variantType"
                  },
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$$isCustomized", true] },
                          { $eq: ["$customizedFood.addVariants.variantType._id", "$$selectedVariantId"] }
                        ]
                      }
                    }
                  },
                  {
                    $project:{
                      "customizedFood.addVariants.variantType":1
                    }
                  },
                  {
                    $addFields:{
                      variantAmountForSingle:"$customizedFood.addVariants.variantType.cutPrice",
                      cutPriceForVariant:{$multiply:["$$quantity","$customizedFood.addVariants.variantType.cutPrice"]},
                      consumerPriceForVariant: { $multiply: ["$$quantity", "$customizedFood.addVariants.variantType.customerPrice"] },
                      mrpPriceForVariant: { $multiply: ["$$quantity", "$customizedFood.addVariants.variantType.mrpPrice"] }
                    }
                  },  
            ],
        })
        .unwind({ path: "$variantDetails", preserveNullAndEmptyArrays: true })
        .lookup({
          from:"products",
          let:{productId:"$productId",quantity:"$quantity",isCustomized:"$isCustomized"}
        })
    }
    catch(error){
        return{status:false,data:error.message?error.message:"Internal server Error"}
    }
}