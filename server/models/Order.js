import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({

    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    items:[
        {
            product:{type:mongoose.Schema.Types.ObjectId,ref:"Product",required:true},
            quantity:{type:Number,default:1},
            price:{type:Number}
            
        } 
        
    ],
    totalPrice:{type:Number,default:0},
    
    status:{type:String,enum:['pending','dispatched','delivered','cancelled'],default:'pending'},
    paymentId:{type:String},
    paymentStatus:{type:String,enum:['success','failed']},
    address:{
        country:{type:String,required:true},
        state:{type:String,required:true},
        city:{type:String,required:true},
        street:{type:String,required:true},
        pincode:{type:String,required:true},
    }
    ,
    coupon:{type:mongoose.Schema.Types.ObjectId,ref:"Coupon"},
    

},{timestamps:true})

const Order = mongoose.model('Order',orderSchema)

export default Order