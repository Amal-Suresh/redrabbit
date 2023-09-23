const express=require('express')
const userRoute=express()
const userController = require('../controller/userController')


userRoute.post('/userLogin',userController.userLogin)
userRoute.get('/products', userController.getProducts)
userRoute.post('/addtocart', userController.updateCart)


module.exports=userRoute;