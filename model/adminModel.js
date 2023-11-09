const mongoose = require('mongoose')

const adminSchema =mongoose.Schema({
    name:{
        type:String,  
    },
     mobile:{
        type:String,
        require:true
    },
    image:{
        type:String, 
    },
    password:{
        type:String,
        require:true 
    },
    status:{
        type:Boolean,
        default:true
    }
})
module.exports = mongoose.model("admin",adminSchema)