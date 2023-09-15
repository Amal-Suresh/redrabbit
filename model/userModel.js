const mongoose = require('mongoose')

const userSchema =mongoose.Schema({
    name:{
        type:String,
        required:true
    },
     mobile:{
        type:Number,
    },
    image:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    }
})
module.exports = mongoose.model("user",userSchema)