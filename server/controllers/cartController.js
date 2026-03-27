import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate({
      path: "items.product",
      select: "name price images",
    });
    if (!cart) {
      return res.status(400).json({
        message: "no cart found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "carth found ",
      success: true,
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "product not found",
        success: false,
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [{ product: productId, quantity, price: product.price }],
        totalPrice: product.price * quantity,
      });
      return res.status(201).json({
        message: "cart created",
        success: true,
        data: cart,
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, price: product.price });
    }

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    await cart.save();

    return res.status(200).json({
      message: "cart updated",
      success: true,
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        message: "cart not found",
        success: false,
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );
    if (itemIndex === -1) {
      return res.status(404).json({
        message: "item not found",
        success: false,
      });
    }

    {
      cart.items[itemIndex].quantity += quantity;
      cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );

      await cart.save();

      return res.status(200).json({
        message: "updated successfully",
        success: true,
        data: cart,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const removeCart = async (req, res) => {
  try {
    const { productId } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        message: "cart not found",
        success: false,
      });
    }

    cart.items = cart.items.filter(
      (items) => items.product.toString() !== productId,
    );

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    await cart.save();

    return res.status(200).json({
      message: "items removed",
      success: true,
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        message: "cart not found",
        success: false,
      });
    }

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();
 return res.status(200).json({
      message: "items cleared",
      success: true,
      data: cart,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
