import mongoose from "mongoose";
import Product from "../models/productModel.js";
import { broadcastStockUpdate } from "../utils/socketUtils.js";

export const createProduct = async (request, response, next) => {
  try {
    const product = await new Product(request.body);
    await product.save();
    return response
      .status(200)
      .json({ message: "Product Added Successfully", data: { product } });
  } catch (exception) {
    next(exception);
  }
};

export const updateProduct = async (request, response, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      request.param.id,
      request.body,
      { new: true }
    );

    if (!product)
      return response.status(404).json({ message: "Product Not Found" });

    response
      .status(200)
      .json({ message: "Product Updated Successfully", data: { product } });
  } catch (exception) {
    next(exception);
  }
};

export const deleteProduct = async (request, response, next) => {
  try {
    const product = await Product.findByIdAndDelete(request.param.id);

    if (!product)
      return response.status(404).json({ message: "Product Not Found" });

    response.status(200).json({ message: "Product Deleted Successfully" });
  } catch (exception) {
    next(exception);
  }
};

export const getAllProducts = async (request, response, next) => {
  try {
    const products = await Product.find({});
    if (!products)
      return response.status(404).json({ message: "No Products Available" });

    response
      .status(200)
      .json({ message: "Products List Get Successfully", data: { products } });
  } catch (exception) {
    next(exception);
  }
};

export const checkoutCart = async (request, response, next) => {
  const cartItems = request.body.cartItems;
  const session = mongoose.startSession();
  (await session).startTransaction();

  try {
    for (const item of cartItems) {
      const product = await Product.findById(item.productId).session(session);

      if (!product || product.stock < item.quantity) {
        (await session).abortTransaction();
        (await session).endSession();
        return response
          .status(400)
          .json({ message: `Insufficient Stock of ${item.productId}` });
      }
      product.quantity -= item.quantity;
      await product.save({ session });
      broadcastStockUpdate(item.productId, product.stock);
    }
    (await session).commitTransaction();
    session.endSession();
    response.status(200).json({ message: "Checkout Successful" });
  } catch (exception) {
    (await session).abortTransaction();
    session.endSession();
    next(exception);
  }
};
