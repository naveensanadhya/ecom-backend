import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const connection = {};

const dbConnect = async () => {
  try {
    if (connection.isConnected) return;

    const database = await mongoose.connect(
      process.env.MONGODB_CONNECTION_STRING,
      {
        connectTimeoutMS: 30000,
        socketTimeoutMS: 30000,
      }
    );
    connection.isConnected = database.connections[0].readyState;
    console.log("Connected to Database");
  } catch (exception) {
    console.log("Database Connection Error: ", exception);
  }
};

export default dbConnect;
