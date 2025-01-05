const express = require("express")
const adminAuthRoute = express.Router()
const adminAuthController = require("../../controller/adminAuthController")


adminAuthRoute.route("/register").post(async(req,res)=>{
        let result = await adminAuthController.registerAdminUser(req)
            res.status(result.code).send(result)
})
adminAuthRoute.route('/')
    .post(async (req, res) => {
        let result = await adminAuthController.addAdminUser(req)
        res.status(result.code).send(result)
})

adminAuthRoute.route("/login").post(async(req,res)=>{
        let result = await adminAuthController.login(req)
            res.status(result.code).send(result)
})

adminAuthRoute.route('/')
    .get(async (req, res) => {
        let result = await adminAuthController.getAdminUser(req)
        res.status(result.code).send(result)
})
adminAuthRoute.route('/:id')
    .get(async (req, res) => {
        let result = await adminAuthController.finduserById(req)
        res.status(result.code).send(result)
})
// //change password
adminAuthRoute.route('/changePassword')
    .post(async (req, res) => {
        let result = await adminAuthController.changePasswordAdmin(req)
        res.status(result.code).send(result)
})
//forgot password
adminAuthRoute.route('/forgotPassword')
.post(async (req, res) => {
    let result = await adminAuthController.forgotPasswordAdmin(req)
    res.status(result.code).send(result)
})

adminAuthRoute.route('/update')
    .post(async (req, res) => {
        let result = await adminAuthController.updateAdminUser(req)
        res.status(result.code).send(result)
})
adminAuthRoute.route('/delete')
    .post(async (req, res) => {
        let result = await adminAuthController.deleteAdminUser(req)
        res.status(result.code).send(result)
})    
module.exports = adminAuthRoute