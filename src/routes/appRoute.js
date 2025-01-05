const express = require('express')
const adminAuthRoute = require('./auth_route/adminAuthRoute')
const productCateRoute = require('./productCateRoute')
const categoryRoute = require('./categoryRoute')
const otpRoute = require('./otpRoute')
const subCateRoute = require('./subCategoryRoute')
const fileRoute = require('./fileRoute')
const productRoute = require('./productRoute')
const addressRoute = require('./addressRoute')
const userRoute = require('./userAuthRoute')
const authRoute = require('./auth_route/authRoute')
const bannerRoute = require('./bannerRoute')
const appRoute = express.Router()



const baseUrl = "/api"

appRoute.initialize = (app) => {
    app.use(`${baseUrl}/admin`,adminAuthRoute )
    app.use(`${baseUrl}/auth`,authRoute )
    app.use(`${baseUrl}/banner`,bannerRoute )
    app.use(`${baseUrl}/user`,userRoute )
    app.use(`${baseUrl}/productCate`,productCateRoute)
    app.use(`${baseUrl}/category`,categoryRoute)
    app.use(`${baseUrl}/otp`,otpRoute)
    app.use(`${baseUrl}/subCategory`,subCateRoute)
    app.use(`${baseUrl}/file`,fileRoute)
    app.use(`${baseUrl}/product`,productRoute)
    app.use(`${baseUrl}/address`,addressRoute)

 

}

module.exports = appRoute