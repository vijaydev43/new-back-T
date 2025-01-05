const request = require('request');

module.exports = {
  randomString: async (length) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },
  apiResponse: (resStatusCode = 200, resStatus = true, resMessageKey = "", resData = {}) => {
    return {
      code: resStatusCode,
      status: resStatus,
      message: resMessageKey,
      data: resData,
    };
  },

  /* generate random otp */
  generateOTP: (length) => {
    let otp = ''

    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10)
    }

    return otp
  },
//   send_sms : (mobileNo, message, templateid) =>{
//     return new Promise((resolve, reject)=>{      
//       const baseurls = `http://www.smsintegra.com/api/smsapi.aspx?uid=ecotec&pwd=18615&mobile=${mobileNo}&msg=${message}&sid=ECTENG&type=0&dtTimeNow=xxxxx&entityid=1601329169658492851&tempid=${templateid}`;
//       console.log("templateid",templateid)
//       request(baseurls, { json: true }, async (err, response, body) => {
//         console.log(err,body)
//         if (err) reject(err);
//         else resolve(body);
//       });
//     });
//   },
  generateReferralForCustomer: (length, userCount) => {
    let referralCode = 'TIFTO';
    for (let i = 0; i < length; i++) {
      referralCode += Math.floor(Math.random() * userCount);
    }
    return referralCode;
  },
  generateOrderCode: (length) => {
    let orderCode = 'TF#';
    const timestamp = Date.now().toString();
      orderCode += `${timestamp}`
    return orderCode;
  },
  generateProductCode: (length) => {
    let orderCode = '#';
    const timestamp = Date.now().toString();
      orderCode += `${timestamp}`
    return orderCode;
  }
}
