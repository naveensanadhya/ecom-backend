import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import { init } from "./utils/socketUtils.js";
import { protect } from "./middlewares/authenticationMiddleware.js";
import errorHandler from "./middlewares/errorHandler.js";
import dbConnect from "./utils/dbConnection.js";
import populateProducts from "./scripts/populateProducts.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = init(server);
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

dbConnect().then(() => {
  populateProducts();
});

app.use("/api/auth", authRoutes);
app.use("/api/products/", protect, productRoutes);
app.use("/api/cart", protect, cartRoutes);
app.use("/api/cart", protect, productRoutes);

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`App is Running on the Port: ${PORT}`);
});
