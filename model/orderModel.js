const mongoose = require('mongoose')

const orderSchema =mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    address:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'address',
        required:true
    },
    location:{
        type:String,
        required:true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'cart',
        required:true
    },
    totalAmount:{
        type:Number,
        required:true
    },
    payment:{
        type:String,
        required:true
    },
    paymentStaus:{
        type:String,
        required:true
    },
    orderStatus:{
        type:String,
        required:true
    },
    orderDate:{
       type:Date,
       required:true
    }
    
})
module.exports = mongoose.model("order",orderSchema)