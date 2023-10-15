const mongoose = require('mongoose')

const userSchema =mongoose.Schema({
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
    status:{
        type:Boolean,
        default:true
    }
})
module.exports = mongoose.model("user",userSchema)