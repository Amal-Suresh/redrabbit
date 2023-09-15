const mongoose = require('mongoose')

const adminSchema =mongoose.Schema({
    name:{
        type:String,  
    },
     mobile:{
        type:Number,
        require:true
    },
    image:{
        type:String, 
    },
    status:{
        type:Boolean,
        default:true
    }
})
module.exports = mongoose.model("admin",adminSchema)