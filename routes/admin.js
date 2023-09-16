const express=require('express')
const adminController=require('../controller/adminController')
const productController=require('../controller/productContoller')
const adminRoute=express()
const multer = require('multer')
const path = require('path');

const storage = multer.diskStorage({
    filename: function(req, file, cb) {
      const name = Date.now()+"-"+file.originalname;
      cb(null, name, function(error, success) {
        if (error) {
          console.log(error);
        }
      });
    }
  });
  const upload = multer({ storage: storage });

adminRoute.post('/login',adminController.adminLogin)
adminRoute.post('/addProduct',upload.single('image'),productController.addProduct)





module.exports=adminRoute;