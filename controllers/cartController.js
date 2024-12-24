import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";
import { broadcastStockUpdate, updateCartCount } from "../utils/socketUtils.js";
import mongoose from "mongoose";
import Order from "../models/orderModel.js";

export const addToCart = async (request, response, next) => {
  const { productId, quantity } = request.body;
  const userId = request.user.id;

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
      cart = new Cart({
        userId: mongoUserId,
        items: [
          {
            productId: mongooProductId,
            quantity: quantity,
          },
        ],
      });
    }
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

export const updateQuantity = async (request, response, next) => {
  const { productId, quantity } = request.body;
  const userId = request.user.id;
  try {
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      model: "Product",
    });

    if (cart) {
      const productIndex = cart.items.findIndex(
        (p) => p.productId._id.toString() === productId
      );

      if (productIndex > -1) {
        const product = await Product.findById(productId);
        if (!product) {
          return response.status(404).json({ message: "Product Not Found" });
        }

        const changedQuantity = quantity - cart.items[productIndex].quantity;

        if (changedQuantity > 0 && product.stock < changedQuantity) {
          return response.status(404).json({ message: "Insufficient Stock" });
        }

        product.stock -= changedQuantity;
        cart.items[productIndex].quantity = quantity;
        cart.items[productIndex].productId.stock = product.stock;

        await product.save();
        await cart.save();
        broadcastStockUpdate(product._id, product.stock);
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

export const removeFromCart = async (request, response, next) => {
  const { productId } = request.body;
  const userId = request.user.id;
  try {
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      model: "Product",
    });

    if (cart) {
      const productIndex = cart.items.findIndex(
        (p) => p.productId._id.toString() === productId
      );

      if (productIndex > -1) {
        const product = await Product.findById(productId);
        if (!product) {
          return response.status(404).json({ message: "Product Not Found" });
        }

        product.stock += cart.items[productIndex].quantity;
        cart.items.splice(productIndex, 1);

        await product.save();
        await cart.save();
        broadcastStockUpdate(product._id, product.stock);
        updateCartCount(cart.items.length || 0);
        return response.status(200).json({
          message: "Product Removed from The Cart",
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

export const checkoutCart = async (request, response, next) => {
  const userId = request.user.id;

  try {
    let cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      model: "Product",
    });

    if (!cart || cart.items.length === 0) {
      return response.status(404).json({ message: "Cart Not Found" });
    }

    let mongoUserId = new mongoose.Types.ObjectId(userId);
    let order = new Order({
      userId: mongoUserId,
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
      })),
      total: cart.items.reduce(
        (total, item) => total + item.quantity * item.productId.price,
        0
      ),
    });

    await order.save();
    await Cart.findOneAndDelete({ userId });
    updateCartCount(0);
    response
      .status(200)
      .json({ message: "Order Placed Successfully", data: { order } });
  } catch (exception) {
    next(exception);
  }
};
