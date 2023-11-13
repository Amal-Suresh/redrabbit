const express=require('express')
const userRoute=express()
const userController = require('../controller/userController')
const orderController = require('../controller/orderController')
const auth = require('../middleware/auth')

userRoute.post('/checkIfUser',userController.checkIfUser)
userRoute.post('/userLogin',userController.userLogin)

userRoute.get('/products', userController.getProducts)
userRoute.post('/addtocart',auth.userAuth,userController.updateCart)
userRoute.get('/cart',auth.userAuth,userController.showCartData)

userRoute.post('/saveUserName',auth.userAuth,userController.saveUserName)
userRoute.get('/getCategory',userController.findAllCategory)
userRoute.get('/userDetails',auth.userAuth,userController.fetchUser)

userRoute.post('/addAddress',auth.userAuth,userController.addAddress)
userRoute.delete('/deleteAddress',auth.userAuth,userController.deleteAddress)
userRoute.get('/getAddress',auth.userAuth,userController.getAddress)
userRoute.get('/getAllAddress',auth.userAuth,userController.getAllAddress)
userRoute.post('/updateAddress',auth.userAuth,userController.updateAddress)


userRoute.post('/codOrder',auth.userAuth,orderController.CodOrder)
userRoute.post('/onlinePayment',auth.userAuth,orderController.onlinePayment)
userRoute.post('/verifypayment',auth.userAuth,orderController.Verifypayment)
userRoute.get('/getOrders',auth.userAuth,orderController.getOrders)

userRoute.post('/cancelOrder',auth.userAuth,orderController.cancelOrder)
module.exports=userRoute;