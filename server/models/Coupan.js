import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discountType: { type: String, enum: ['flat', 'percentage'], required: true },
    discountValue: { type: Number, required: true },
    minOrderValue: { type: Number, default: 0 },
    expiry: { type: Date, required: true },
    usageLimit: { type: Number, required: true },
    usedCount: { type: Number, default: 0 }
}, { timestamps: true })

const Coupon = mongoose.model('Coupon', couponSchema)
export default Coupon