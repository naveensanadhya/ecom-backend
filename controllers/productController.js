import Product from "../models/productModel.js";

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
