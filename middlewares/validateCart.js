import Product from "../models/productModel.js";
export const validateCart = async (request, response, next) => {
  const cartItems = request.body.cartItems;

  try {
    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        return response
          .status(400)
          .json({ message: `Insufficient Stock for: ${item.productId}` });
      }
    }
    next();
  } catch (exception) {
    next(exception);
  }
};
