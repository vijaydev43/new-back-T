const jwt = require('jsonwebtoken');
const url = require('url');
const tokenHelper = require('../helper/tokenHelper')


const AuthMiddleWare = async (req, res, next) => {
  try {
    const pathname = url.parse(req.originalUrl).pathname;

    if (
      pathname == '/api/admin/login'  ||pathname =="/api/email/requestOtp" || pathname=="/api/admin/forgotPassword") {
      return next();
    }
    if(pathname== '/api/file/bannerUpload'){
      return next();
    }

    if ( 
      pathname == '/api/subAdmin/login' || pathname == '/api/subAdmin/register' || pathname == '/api/adminUser/emailVerification/' || pathname == '/api/region' || pathname=='/api/subAdmin/forgotPassword') {
      return next();
    }



    if (req.originalUrl == '/api/authUser/register' || req.originalUrl == '/api/authlist/token' || req.originalUrl == '/api/verifyOtp' || req.originalUrl == '/api/requestOtp' || req.originalUrl == '/api/otp') {
      return next()
    }

    if (req.originalUrl == '/api/productCate' || req.originalUrl == '/api/foodCategory' || req.originalUrl == '/api/adminUser' ) {
      return next()
    }
    if (!req?.headers?.userid || (req?.headers?.userid == "")) {
      return res.status(403).send({ code: 403, status: false, message: 'Invalid Request', data: 'Please provide valid userid' });
    }

    if (!req?.headers?.authorization || req?.headers?.authorization == "") {
      return res.status(403).send({ code: 403, status: false, message: 'Token missing', data: 'Token missing in headers' });
    }
    let userId = req?.headers?.userid;
    let authorization = req?.headers?.authorization
    // const authHeader = req.headers['authorization'];
    const token = authorization && authorization.split(' ')[1];
    const tokenDecoded = await tokenHelper.verifyAccessToken(token)
    console.log("token ", tokenDecoded)
    if (!tokenDecoded) {
      return res.status(401).send({ status: false, message: 'Authentication error Token Decoding Failed', data: {} })
    }
    console.log("token user id", tokenDecoded.userId)
    console.log("token mobile", tokenDecoded.phoneNo)
    const tokenUserId = tokenDecoded.userId;
    if (!tokenUserId) {
      return res.status(401).send({ status: false, message: 'Authentication error Token Missing User Data', data: "User data missing" })
    }
    if (userId != tokenUserId) {
      return res.status(401).send({ status: false, message: 'Invalid user', data: "Invalid user access" })
    }
    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: 'Internal-Server-Error', data: `RequestMiddleWareError:${error.message}` })
  }
}

module.exports = AuthMiddleWare
