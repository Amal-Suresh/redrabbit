const mongoose = require('mongoose')

const userSchema =mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
     mobile:{
        type:Number,
    },
    image:{
        type:String
    },
    status:{
        type:Boolean,
        default:true
    },
    wallet:{
        type:Number
    },
    walletHistory:{
        type:[{
            tdate:{type:Date},
            amount:{type:Number},
            tType:{type:String}
        }]
    },
    isVerified:{
        type:Boolean,
        default:false
    }
})
module.exports = mongoose.model("user",userSchema)