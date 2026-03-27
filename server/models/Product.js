import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    price: { type: Number, required: true },
    discountPrice:{type:Number},
    stock:{type:Number,required:true,default:0},
    images:[{type:String}],

    category:{type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    ratings:{type:Number,default:0},
    numReviews: { type: Number, default: 0 }
},{timestamps:true})

const Product = mongoose.model('Product',productSchema)

export default Product