const Razorpay = require("razorpay");
const crypto = require("crypto");
const paymentService = new Object();

const instance = new Razorpay({
  //key_id:  'rzp_test_GVjiZwBV7OnvUK',
  //key_secret:'mjQvJ2XvxMruyQKUvvywJwPk',

//keyid test for infotech
// key_id :'rzp_test_eNORhJ1wvQSVVv',
// key_secret:'ZtncR8YtB4VeLIKDr6vf1gtt'
// key_id :'rzp_live_jJ3bJZ7AtmVWdH',
// key_secret:'DQ9PP4JnZckM7gWVrDSl4dgC'
});

paymentService.razorPayCreateOrder = async (data) => {
  try {
    const { amount, currency, receipt, notes } = data;
    let response = {};
    instance.orders.create({ amount, currency, receipt, notes },
      (err, order) => {
        console.log(err,order,"123456")
        if (!err) {
          response = { code: 200,status: true,data: order}
        }
        else {
          return { status: false, code: 400, data: [] }
        }
      }
    )
    await resolveAfter1Seconds();
    return response;
  } catch (error) {
    return { status: false, data: error.message ? error.message : error }
  }
}

function resolveAfter1Seconds() {
  try {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('resolved');
      }, 2000);
    });
  } catch (error) {
    return { status: false, data: error.message ? error.message : error }
  }
}

paymentService.fetchByOrderIdFromRazorpay = async (id) => {
    try {
      let response = {};
      instance.orders.fetch((id),
        (err,order) => {
          if (!err) {
            response = {code: 200,status: true,data: order};
          }
          else {
            return { status: false, code: 400, data: [] }
          }
        }
      )
      await resolveAfter1Seconds();
      return response;
    } catch (error) {
      return { status: false, data: error.message ? error.message : error }
    }
}

paymentService.fetchPaymentsByOrderId = async (id) => {
    try {
      let response = {};
      instance.orders.fetchPayments((id),
        (err,order) => {
          if (!err) {
            response = {code: 200,status: true,data: order};
          }
          else {
            return { status: false, code: 400, data: [] }
          }
        }
      )
      await resolveAfter1Seconds();
      return response;
    } catch (error) {
      return { status: false, data: error.message ? error.message : error }
    }
}
paymentService.refundByPaymentId = async(data) =>  {
    try  {
      const refund = await instance.payments.refund(
        data?.paymentId,
         {         "amount": data?.amount,
         "currency": data?.currency ? 
         data.currency:"INR",
         "speed": data?.speed,
         "speed_processed":data?.speed_processed
         });

      console.log("Refund created successfully:", refund);
      return {code: 200,status: true,data: refund};
        // instance.payments.refund(data?.paymentId,{
        //     "amount": data?.amount,
        //     "currency": data?.currency ? data.currency:"INR",
        //     "receipt": data?.receipt,
        //     "speed": data?.speed,
        //     "notes" :data?.notes
        //   },(err,order) => {
            
        //     if (!err) {
        //       console.log("successfully refund amount")
        //       return {code: 200,status: true,data: order};
        //     } else {
        //       console.log("refund error ", err)
        //       return { status: false, code: 400, data: [] }
        //     }
        //   },err=>  {
        //     return { status: false, code: 400, data: [] }
        //   })
        //   return { status: false, code: 400, data: [] }
    }  catch(err)  {
      console.log("refund error ", err)
        return { status: false, data: err.error }
    }
}

paymentService.refundStatusByRefundId = async(refundId) =>  {
  try  {
    const refund = await instance.refunds.fetch(refundId);
    // const refund = await instance.payments.refund(data?.paymentId, {         "amount": data?.amount,
    //    "currency": data?.currency ? data.currency:"INR", });

    console.log("Refund created successfully:", refund);
    return {code: 200,status: true,data: refund};
  }  catch(err)  {
    console.log("refund error ", err)
      return { status: false, data: err.error }
  }
}

paymentService.verifySignature = async (body) => {
  try {
    let reqSignature = body?.razorPaySignature ? body?.razorPaySignature : undefined;
    let reqOrderId = body?.razorPayOrderId ? body.razorPayOrderId : undefined;
    let reqPaymentId = body?.razorPayPaymentId ? body.razorPayPaymentId : undefined;

    let generatedSignature = crypto
      .createHmac(
        "SHA256",
        process?.env?.PAYMENT_KEY_SECRET
      )
      .update(reqOrderId + "|" + reqPaymentId)
      .digest("hex");

    let isSignatureValid = generatedSignature == reqSignature;
    if (!isSignatureValid) {
      return { status: false, code: 400, message: "Signature Verification Failed" };
    } else {
      return { status: true, code: 200, message: "Signature Verification Success" };
    }
  } catch (error) {
    return { status: false, data: error.message ? error.message : error }
  }
}


module.exports = paymentService;