const order = require('../model/orderModel')

// ---------------------------------------------------- Cod payment --------------------------------------------

const CodOrder = async (req,res) =>{
   try {
    console.log("req.body : ",req.body)
     console.log("Hello this is order controller")
     const {product,address,payment,totalAmount} = req.body;
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

// ----------------------------------------------------Initialize razorpay --------------------------------------------

const onlinePayment = async (req, res) => {
    try {
      console.log("entetered payment")
      var instance = new Razorpay({
        key_id: 'rzp_test_Qt18oumm8k0BKa',
        key_secret: 'vZ035cWAKANlYeO7bZxShcNT'
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
  
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  
    }
  }

// ---------------------------------------------------- Varify --------------------------------------------

  const Verifypayment = async (req, res) => {
    try {
    const {product,address,payment,totalAmount} = req.body;
      const body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id 
      var expectedSignature = crypto.createHmac("sha256", "vZ035cWAKANlYeO7bZxShcNT");
      await expectedSignature.update(body.toString());
      expectedSignature = await expectedSignature.digest("hex");
      if (expectedSignature == req.body.response.razorpay_signature) {
        const orderData = new order({
            userId:req.id,
            product,
            address,
            payment,
            totalAmount,
            paymentStatus:"success",
            orderStatus:"ordered",
            orderDate:Date.now()
        })
        const orders = await orderData.save()
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
      const orderData = await order.find().populate('userId').populate('product')
      if(orderData){
        return res.status(200).json({status:true,orderData})
      }else{
        return res.status(200).json({status:false,message:"no orders found"})
      }
   } catch (error){
     res.status(500).json({message:"internal server error"})
   }
}

module.exports={
    CodOrder,onlinePayment,Verifypayment,getOrders
}