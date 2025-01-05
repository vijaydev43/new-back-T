const express = require("express");
const userController = require('../controller/userController');
const userRoute = express.Router();

userRoute.route("/").post(async(req,res)=>{
  let result = await userController.userRegister(req)
  res.status(result.code).send(result)
})
userRoute.route("/login").post(async(req,res)=>{
  let result = await userController.login(req)
  res.status(result.code).send(result)
})
userRoute.route("/:userId")
  .put(async (req, res) => {
    let result = await userController.updateUserById(req);
    res.status(result.code).send(result)
})
userRoute.route("/:userId")
  .delete(async (req, res) => {
    let result = await userController.deleteUserById(req);
    res.status(result.code).send(result)
})

userRoute.route('/')
.get(async(req,res)=>{
  let result = await userController.findAllUser(req)
  res.status(result.code).send(result)
})

userRoute.route("/id")
.get(async(req,res)=>{
  let result = await userController.findUserById(req)
  res.status(result.code).send(result)
})

module.exports = userRoute;