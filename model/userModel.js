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
    }, address: [{
        name:{type:String},
        address:{type:String},
        street:{type:String},
        post:{type:String},
        city:{type:String},
        pin:{type:Number},
        state:{type:String},
        mobile:{type:String},
        status:{type:Boolean,default:false}
    }]
})
module.exports = mongoose.model("user",userSchema)