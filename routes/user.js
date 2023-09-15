const express=require('express')
const userRoute=express()
const userController = require('../controller/userController')


userRoute.post('/userLogin',userController.userLogin)


module.exports=userRoute;