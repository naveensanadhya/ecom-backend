import Product from "../models/productModel.js";

const initialProducts = [
  {
    name: "Product 1",
    description: "Description for product 1",
    price: 100,
    stock: 50,
  },
  {
    name: "Product 2",
    description: "Description for product 2",
    price: 200,
    stock: 30,
  },
  {
    name: "Product 3",
    description: "Description for product 3",
    price: 300,
    stock: 20,
  },
  {
    name: "Product 4",
    description: "Description for product 4",
    price: 400,
    stock: 10,
  },
  {
    name: "Product 5",
    description: "Description for product 5",
    price: 500,
    stock: 5,
  },
];

const populateProducts = async () => {
  try {
    const productExist = await Product.find({});
    if (productExist.length === 0) {
      await Product.insertMany(initialProducts);
      console.log("Products Populated Successfully");
    } else {
      console.log("Products Already Populated");
    }
  } catch (exception) {
    console.log("Exception Popluating Products: ", exception);
  }
};

export default populateProducts;
