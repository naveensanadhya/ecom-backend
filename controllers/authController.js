import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
dotenv.config();

export const register = async (request, response, next) => {
  const { username, password } = request.body;

  try {
    const user = new User({ username, password });
    await user.save();
    response.status(200).json({ message: "User Registered Successfully" });
  } catch (exception) {
    next(exception);
  }
};

export const login = async (request, response, next) => {
  const { username, password } = request.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return response.status(400).json({ message: "User Not Found" });

    const passwordMatched = bcrypt.compare(password, user.password);
    if (!passwordMatched)
      return response
        .status(400)
        .json({ message: "Invalid Username or Password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "60m",
    });
    response
      .status(200)
      .json({ message: "User Logged In Successfully", data: { token } });
  } catch (exception) {
    next(exception);
  }
};
