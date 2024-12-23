import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: String,
  description: String,
  price: Number,
  stock: Number,
});
export default mongoose.model("Product", userSchema);
