import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";
import { broadcastStockUpdate, updateCartCount } from "../utils/socketUtils.js";
import mongoose from "mongoose";

export const addToCart = async (request, response, next) => {
  const { productId, quantity } = request.body;
  const userId = request.user.id;

  console.log("Enteerd in Cart Add: ", { productId, quantity }, userId);
  try {
    const product = await Product.findById(productId);
    if (!product || product.stock < quantity) {
      return response
        .status(400)
        .json({ message: "Insufficient Stock for this product" });
    }

    let cart = await Cart.findOne({ userId });
    if (cart) {
      const productIndex = cart.items.findIndex(
        (p) => p.productId.toString() === productId
      );

      if (productIndex > -1) {
        cart.items[productIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    } else {
      let mongoUserId = new mongoose.Types.ObjectId(userId);
      let mongooProductId = new mongoose.Types.ObjectId(productId);
      console.log("CA Mongo: ", mongoUserId, mongooProductId, quantity);
      cart = new Cart({
        userId: mongoUserId,
        items: [
          {
            productId: mongooProductId,
            quantity: quantity,
          },
        ],
      });
      // cart.userId = userId;
      // cart.items = [{ productId, quantity }];
    }
    console.log("Cart: ", cart);
    await cart.save();
    product.stock -= quantity;
    await product.save();
    broadcastStockUpdate(product._id, product.stock);

    updateCartCount(cart.items.length || 0);
    response
      .status(200)
      .json({ message: "Product Added to Cart", data: { cart } });
  } catch (exception) {
    next(exception);
  }
};

export const removeFromCart = async (request, response, next) => {
  const { productId, quantity } = request.body;
  const userId = request.user.id;
  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      const productIndex = cart.items.findIndex(
        (p) => p.productId.toString() === productId
      );

      if (productIndex > -1) {
        const product = await Product.findById(productId);
        if (!product) {
          return response.status(404).json({ message: "Product Not Found" });
        }

        if (cart.items[productIndex].quantity > quantity) {
          cart.items[productIndex].quantity -= quantity;
          product.stock += quantity;
        } else {
          product.stock += cart.items[productIndex].quantity;
          cart.items.splice(productIndex, 1);
        }

        await product.save();
        broadcastStockUpdate(product._id, product.stock);

        await cart.save();
        updateCartCount(cart.items.length || 0);
        return response.status(200).json({
          message: "Product Quantity Updated in The Cart",
          data: { cart },
        });
      }
      return response
        .status(404)
        .json({ message: "Product Not Found in The Cart" });
    }
    return response.status(404).json({ message: "Cart Not Found" });
  } catch (exception) {
    next(exception);
  }
};

export const getCart = async (request, response, next) => {
  const userId = request.user.id;

  try {
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      model: "Product",
      as: "product",
    });
    if (!cart) {
      return response.status(404).json({ message: "Cart Not Found" });
    }
    response.status(200).json({ message: "Cart Details", data: { cart } });
  } catch (exception) {
    next(exception);
  }
};

export const getCartCount = async (request, response, next) => {
  const userId = request.user.id;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    response.status(200).json({
      message: "Cart Details",
      data: { cartCount: !cart ? 0 : cart?.items?.length },
    });
  } catch (exception) {
    next(exception);
  }
};

export const clearCart = async (request, response, next) => {
  const userId = request.user.id;
  try {
    const cart = await Cart.findOneAndDelete({ userId });
    if (!cart) {
      return response.status(404).json({ message: "Cart Not Found" });
    }
    updateCartCount(cart.items.length || 0);
    response.status(200).json({ message: "Cart Cleared" });
  } catch (exception) {
    next(exception);
  }
};
