const order = require('../model/orderModel')

const CodOrder = async (req,res) =>{
   try {
    console.log("req.body : ",req.body)
     console.log("Hello this is order controller")
     const {id,product,address,payment,totalAmount} = req.body;
     console.log("id", req.id)
     const orderData = new order({
        userId:req.id,
        product,
        address,
        payment,
        totalAmount,
        paymentStatus:"pending",
        orderStatus:"ordered",
        orderDate:Date.now()
     })
     const orders = await orderData.save()
     if(orders){
         res.status(200).json({success:true,orders,message:"successfully order completed"})     
     }else{
        res.status(404).json({success:false,message:"something error"})
     }
   } catch (error) {
     console.log("codOrder error",error.message)
     res.status(500).json({message:"server error"})
   }
}
module.exports={
    CodOrder
}