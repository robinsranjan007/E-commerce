import mongoose from "mongoose"

const userSchema =new mongoose.Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    email:{type:String,required:true},
    contactNumber:{type:String},
    password:{type:String,required:true},
    gender:{type:String,enum:['Male','Female']},
    role:{type:String,enum:['customer','admin'],default:'customer',required:true},
    address:[{
        Country:{type:String,required:true},
        state:{type:String,required:true},
        city:{type:String,required:true},
        street:{type:String,required:true},
        pincode:{type:String,required:true},
    }]
},{timestamps:true})

const User= mongoose.model('User',userSchema)
export default User

