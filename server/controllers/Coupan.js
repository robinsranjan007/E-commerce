import Coupon from "../models/Coupan.js";

export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minOrderValue,
      expiry,
      usageLimit,
    } = req.body;

    if (!code || !discountType || !discountValue || !expiry || !usageLimit) {
      return res.status(400).json({
        message: "missing coupan details",
        success: false,
      });
    }

    const coupan = await Coupon.create({
      code,
      discountType,
      discountValue,
      minOrderValue,
      expiry,
      usageLimit,
    });

    return res.status(201).json({
      message: "coupan created successfully",
      success: true,
      data: coupan,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const coupans = await Coupon.find();

    if (coupans.length === 0) {
      return res.status(404).json({
        message: "No coupan found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "coupans",
      success: true,
      data: coupans,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const deleteCoupons = async (req, res) => {
  try {
    const { coupanId } = req.params;

    const coupans = await Coupon.findByIdAndDelete(coupanId);

    if (!coupans) {
      return res.status(404).json({
        message: "No coupan found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "coupans celeted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};



export const updateCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minOrderValue,
      expiry,
      usageLimit,
    } = req.body;

    const {coupanId} = req.params

  
    const coupan = await Coupon.findByIdAndUpdate(coupanId,{
      code,
      discountType,
      discountValue,
      minOrderValue,
      expiry,
      usageLimit,
    },{new :true});


      if (!coupan) {
      return res.status(404).json({
        message: "missing coupan",
        success: false,
      });
    }


    return res.status(200).json({
      message: "coupan updated successfully",
      success: true,
      data: coupan,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};


export const validateCoupon = async (req, res) => {
  try {
    const { code, orderTotal } = req.body

    const coupon = await Coupon.findOne({ code })

    if (!coupon) {
      return res.status(404).json({
        message: "coupon not found",
        success: false,
      })
    }

    // expiry check
    if (coupon.expiry < new Date()) {
      return res.status(400).json({
        message: "coupon expired",
        success: false,
      })
    }

    // usage limit check
    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        message: "coupon limit exceeded",
        success: false,
      })
    }

    // min order check
    if (orderTotal < coupon.minOrderValue) {
      return res.status(400).json({
        message: `minimum order value is ${coupon.minOrderValue}`,
        success: false,
      })
    }

    // usedCount increment
    coupon.usedCount += 1
    await coupon.save()

    return res.status(200).json({
      message: "coupon valid",
      success: true,
      data: {
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderValue: coupon.minOrderValue,
      },
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    })
  }
}