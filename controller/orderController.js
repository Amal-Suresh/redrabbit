const order = require('../model/orderModel')
const cart = require('../model/cartModel')
const Razorpay = require('razorpay')
// ---------------------------------------------------- Cod payment --------------------------------------------

const CodOrder = async (req,res) =>{
   try {
     const {paymentType,address,payment,totalAmount} = req.body;
     const cartDatas = await cart.findOne({userId:req.id}).populate("products.productId")
     const products = cartDatas.products.map((item) => ({
      productId: item.productId,
      name:item.productId.name,
      image:item.productId.image,
      price:item.productId.price,
      quantity: item.quantity,
    }));
     const orderData = new order({
        userId:req.id,
        product:products,
        address,
        payment,
        paymentType,
        totalAmount,
        paymentStatus:"pending",
        orderStatus:"ordered",
        orderDate:Date.now()
     })
     const orders = await orderData.save()
     const cartData = await cart.deleteOne({userId:req.id})
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

// ----------------------------------------------------Initialize razorpay --------------------------------------------

const onlinePayment = async (req, res) => {
    try {
      console.log("entetered payment")
      var instance = new Razorpay({
        key_id: 'rzp_test_gpsSZl75alIqZ8',
        key_secret: 'VFMBX9IMDUWNepz439p1RtP4'
      });
      const options = {
        amount: req.body.amount * 100,
        currency: "INR",
      }   
      instance.orders.create(options, function (err, order) {
        if (err) {
          return res.send({ code: 500, message: "Server Err." })
        }
        return res.send({ code: 200, success: true, message: 'order created', data: order })
      })
  
    }catch (error){
      res.status(500).json({ error: 'Internal server error' });
    }
  }

// ---------------------------------------------------- Varify --------------------------------------------

  const Verifypayment = async (req, res) => {
    try {
    const {paymentType,address,payment,totalAmount} = req.body; 
    const cartDatas = await cart.findOne({userId:req.id}).populate('products.productId')
    const products = cartDatas.products.map((item) => ({
      productId: item.productId,
      name:item.productId.name,
      image:item.productId.image,
      price:item.productId.price,
      quantity: item.quantity,
    }));
      const body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id 
      var expectedSignature = crypto.createHmac("sha256", "VFMBX9IMDUWNepz439p1RtP4");
      await expectedSignature.update(body.toString());
      expectedSignature = await expectedSignature.digest("hex");
      if (expectedSignature == req.body.response.razorpay_signature){
        const orderData = new order({
            userId:req.id,
            product:products,
            address,
            payment,
            paymentType,
            totalAmount,
            paymentStatus:"success",
            orderStatus:"ordered",
            orderDate:Date.now()
        })
        const orders = await orderData.save()
        const cartData = await cart.deleteOne({userId:req.id})
        return res.send({ success: true , orders})
      } else {
        return res.status(404).json({ success: false })
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

// ---------------------------------------------------- getOrders --------------------------------------------


const getOrders = async(req,res) =>{
   try {
      console.log("getOrders")
      console.log(req.id)
      const orderData = await order.find({userId:req.id}).populate('product.productId')
      if(orderData.length>0){
        return res.status(200).json({status:true,orderData})
      }else{
        return res.status(200).json({status:false,message:"no orders found"})
      }
   } catch (error){
     res.status(500).json({message:"internal server error"})
   }
}


// ----------------------------------------------------  order Management admin side--------------------------------------------

const orderManage = async(req,res) =>{
    try {
       let orderId = req.query.id
       const orderStatus = req.body.orderStatus;
       let orderData;
       if(orderStatus == "cancelled"){
         orderData = await order.updateOne({_id:orderId},{$set:{orderStatus:"cancelled"}})
       }else if(orderStatus == "delivered"){
         orderData = await order.updateOne({_id:orderId},{$set:{orderStatus:"delivered",paymentStatus:"success"}})
       }else if(orderStatus == "picked up"){
         orderData = await order.updateOne({_id:orderId},{$set:{orderStatus:"pickedUp"}})
       }else if(orderStatus == "ordered"){
         orderData = await order.updateOne({_id:orderId},{$set:{orderStatus:"ordered"}})
       }else if(orderStatus === "out for delivery"){
        console.log("orderdata is out for delivery")
        orderData = await order.updateOne({_id:orderId},{$set:{orderStatus:"out for delivery"}})
       }else if(orderStatus == "processing"){
        orderData = await order.updateOne({_id:orderId},{$set:{orderStatus:"processing"}})
       }
       return res.status(200).json({status:true,message:"successfully order status changes to"+" "+orderStatus,orderData})
    } catch (error){      
      res.status(500).json({message:"internal server error"})
    }
}
// ---------------------------------------------------- order cancel by user --------------------------------------------

const cancelOrder = async(req,res) =>{
  try {
     let orderId = req.query.id
     let orderStatus = req.body.orderStatus
     let orderData;
     if(orderStatus === "cancelled"){
       orderData = await order.updateOne({_id:orderId},{$set:{orderStatus:"cancelled"}})
     }
     return res.status(200).json({status:true,message:"successfully cancelled",orderData})

  } catch (error){
    res.status(500).json({message:"internal server error"})
  }
}


module.exports={
  CodOrder,onlinePayment,Verifypayment,getOrders,cancelOrder,orderManage,cancelOrder
}