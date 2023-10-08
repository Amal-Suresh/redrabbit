const mongoose = require('mongoose')

const productSchema =mongoose.Schema({
    name:{
        type:String,
        required:true  
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category',
        required:true  
    },
    image:{
        imageUrl:{type:String},
        imageId:{type:String},
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    isBlocked:{
        type:Boolean,
        default:false
    }
})
module.exports = mongoose.model("product",productSchema)