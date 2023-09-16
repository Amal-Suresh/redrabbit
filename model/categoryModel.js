const mongoose = require('mongoose')

const categorySchema =mongoose.Schema({
    name:{
        type:String,
        required:true  
    },
    image:{
        type:String,
        required:true
    },
    isBlocked:{
        type:Boolean,
        default:true
    }
})
module.exports = mongoose.model("user",userSchema)