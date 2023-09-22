const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    products: [
        {
            prodcutId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'croduct',
                required: true
            },
            quantity: {
                type: Number,
                default: 1
            },
            price: {
                type: Number,
                default: 0
            },
        }
    ]
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model("cart", cartSchema)