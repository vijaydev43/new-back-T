let fcm = require("fcm-notification");
let admin = require("firebase-admin");
let serviceAccount = require("../helper/key.json");
const certpath = admin.credential.cert(serviceAccount);
let FCM = new fcm(certpath);
const notificationService = new Object();
const userModel = require("../model/userAuthModel");
const adminModel = require("../model/adminAuthModel")
const subAdmin = require("../model/auth_model/subAdminModel")
const { Types } = require("mongoose")


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

notificationService.sendMessageAllDevice = async (data) => {
  // let queryArray = [{ deleted: false }, { role: 'consumer' }];
  // console.log(`kskks ${queryArray}  ${queryArray}`);
  console.log("data", data)
  const projection = { _id: 0, fcmToken: 1 };
  let result;
  if (data["notificationType"] == "consumer") {
    result = await userModel.find({ role: 'consumer' }, projection);

  }
  if (data["notificationType"] == "vendorAdmin") {
    result = await adminModel.find({ adminUserType: 'vendorAdmin' }, projection);
  }
  if (data["notificationType"] == "subAdmin") {
    result = await subAdmin.find({}, projection);
  }
  if (data["notificationType"] == "deliveryman") {
    let queryArray = [{ role: 'deliveryman' },{isVerified:true}];
    if (data?.parentAdminUserId) {
      console.log("data", data.parentAdminUserId)
      queryArray.push({ parentAdminUserId: new Types.ObjectId(data.parentAdminUserId) })
    }
    result = await userModel.aggregate().match({ $and: queryArray }).project({
      _id: 0, fcmToken: 1

    }).exec();
    // result = await userModel.find(queryArray, projection);
  }

  // const registration = result
  //   .filter(value => value.fcmToken && value.fcmToken !== '') // Filter out objects without FCM tokens
  //   .map(value => value.fcmToken);

  // console.log(registration.length);
  // if (registration.length === 0) {
  //   console.log('No valid FCM tokens found.');
  //   return;
  // }

  // const message = {
  //   notification: {
  //     title: data['title'],
  //     body: data['body'],
  //     image: data['image']
  //   },
  //   tokens: registration
  // };
  console.log("result ", result)
  const chunkSize = 500;
  for (let i = 0; i < result.length; i++) {
    // const tokensChunk = registration.slice(i, i + chunkSize);
    // message.tokens = tokensChunk;
    console.log("token", result[i].fcmToken)
    if (result[i].fcmToken == "null") {
      console.log("token ", result[i].fcmToken)
    } else {
      const dataVal = {
        title: data['title'],
        body: data['body'],
        image: data['image'],
        fcmToken: result[i].fcmToken
      };
      console.log("data", dataVal)
      notificationService.sendMessageUserBased(dataVal)

    }
    // try {
    //   const response = await admin.messaging().sendMulticast(message);
    //   console.log(response.successCount + ' messages were sent successfully');
    //   console.log(response.failureCount);
    // } catch (error) {
    //   console.error('Error sending multicast message:', error);
    // }
  }

}

notificationService.sendMessageUserBased = async (data) => {
  let data1 = {}
  data1["fcmToken"] = data?.fcmToken
  data1["title"] = data["title"]///`Hi ${data?.userDetails?.name}, your order ${data?.orderCode} assigned to our deliveryman`;
  data1["body"] = data["body"] //'From Fast-x, thanks.';
  data1["image"] = data["image"]
  if (data1?.fcmToken && data1?.fcmToken != '') {
    console.log("firebase data", data1)
    let re = await notificationService.createNotification(data1);
    console.log("re ", JSON.stringify(re))
  }
}


// notificationService.sendMessageService = async (data) => {
//   for (let value of data) {
//     value["title"] = 'New Order Arrived.....!';
//     value["body"] = 'From Fast-x, thanks.';
//     if (value?.fcmToken && value?.fcmToken != '') {
//       await notificationService.createNotification(value);
//     }
//   }

// }
// notificationService.sendMessageService1 = async (data1) => {
//   let data = {}
//   data["fcmToken"] = "e0Ra6y_GSaGqoLPea1Nmfw:APA91bHwvVSGUyTMxwMn_yqIqxgrxZ6qWaF0og60p0iZTbKgSRffr5rxq2tDNz2Acs4-hV_oY-fvlUwYrXoxwA9c1V4530jBJX8FMBrze_6FCziuJOW0SYMAvQ4tyKj8eo-16_yDeo9i"
//   //data["fcmToken"] = data1?.fcmToken
//   data["title"] = 'New Order Assigned to you please check.....!';
//   data["body"] = 'From Fast-x, thanks.';
//   if (data?.fcmToken && data?.fcmToken != '') {
//     await notificationService.createNotification(data);
//   }
// }
// notificationService.sendMessageService2 = async (data) => {
//   let data1 = {}
//   data1["fcmToken"] = data?.userDetails?.fcmToken
//   data1["title"] = `Hi ${data?.userDetails?.name}, your order ${data?.orderCode} assigned to our deliveryman`;
//   data1["body"] = 'From Fast-x, thanks.';
//   if (data1?.fcmToken && data1?.fcmToken != '') {
//     await notificationService.createNotification(data1);
//   }
// }
// notificationService.sendMessageService3 = async (data, status) => {
//   let data1 = {}
//   data1["fcmToken"] = data?.userDetails?.fcmToken
//   if (status != 'delivered') {
//     data1["title"] = `Hi ${data?.userDetails?.name}, your order ${data?.orderCode} in status of ${status} will deliver soon...!`;
//   } else {
//     data1["title"] = `Hi ${data?.userDetails?.name}, your order ${data?.orderCode}  ${status} successfully`;
//   }

//   data1["body"] = 'From Fast-x, thanks.';
//   if (data1?.fcmToken && data1?.fcmToken != '') {
//     await notificationService.createNotification(data1);
//   }
// }
notificationService.createNotification = async (data) => {
  let message = {
    notification: {
      title: `${data?.title}`,
      body: `${data?.body}`,
      image: `${data?.image}`
    },
    data: {
    },
    token: `${data?.fcmToken}`
  };
  FCM.send(message, function (err, resp) {
    if (err) {
      console.log("error ", err)
    } else {
      console.log("success", resp);
    }
  })
}
module.exports = notificationService;