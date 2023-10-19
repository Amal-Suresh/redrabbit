const express=require('express')
const userRoute=express()
const userController = require('../controller/userController')
const auth = require('../middleware/auth')

userRoute.post('/checkIfUser',userController.checkIfUser)
userRoute.post('/userLogin',userController.userLogin)

userRoute.get('/products', userController.getProducts)
userRoute.post('/addtocart',auth.userAuth,userController.updateCart)
userRoute.get('/cart',auth.userAuth,userController.showCartData)

userRoute.post('/saveUserName',auth.userAuth,userController.saveUserName)
userRoute.get('/getCategory',userController.findAllCategory)
userRoute.get('/userDetails',auth.userAuth,userController.fetchUser)




module.exports=userRoute;