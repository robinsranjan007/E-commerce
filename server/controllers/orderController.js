import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export const createOrder = async (req, res) => {
  try {
    const { address } = req.body;

    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
    );
    if (!cart) {
      return res.status(404).json({
        message: "cart not found",
        success: false,
      });
    }
    if (cart.items.length === 0) {
      return res.status(404).json({
        message: "cart not found",
        success: false,
      });
    }

    const order = await Order.create({
      user: req.user.id,
      items: cart.items,
      totalPrice: cart.totalPrice,
      address,
    });

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({
      message: "order created",
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate({
      path: "items.product",
      select: "name price images",
    });

    if (orders.length === 0) {
      return res.status(404).json({
        message: "no orders found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "order",
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const allorders = await Order.find()
      .populate({
        path: "items.product",
        select: "name price images",
      })
      .populate({
        path: "user",
        select: "firstName lastName email",
      });

    if (allorders.length === 0) {
      return res.status(404).json({
        message: "No orders ",
        success: false,
      });
    }

    return res.status(200).json({
      message: "order",
      success: true,
      data: allorders,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getOrdersById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate({
        path: "items.product",
        select: "name price images",
      })
      .populate({
        path: "user",
        select: "firstName lastName email",
      });

    if (!order) {
      return res.status(404).json({
        message: "order not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "order",
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(orderId, { status },{new:true});

    if (!order) {
      return res.status(404).json({
        message: "order not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "order",
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
