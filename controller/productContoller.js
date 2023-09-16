const Product = require('../model/productModel')
const cloudinary =require('../utils/cloudnery')


const addProduct = async(req,res)=>{
    try {
    const { name, discription, category } = req.body
    let imageUrl=''
    let imageId=''
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { folder: "productImg" })
         imageUrl = result.secure_url
         imageId = result.public_id
        }
       const product=new Product({
        name,
        discription,
        category,
        image:{
            imageUrl,
            imageId
        }
       })
       const updateProduct= await product.save()
       if(updateProduct){
        res.status(200).send({ success: true, message: "product added successfully" })
       }else{
        res.status(401).send({ success: false, message: "product upload failed" })
       }  
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success:false, message: "something went wrong" })   
    }
}




module.exports={
    addProduct  
}