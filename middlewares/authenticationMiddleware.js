import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export const protect = (request, response, next) => {
  if (!request.header("Authorization")) {
    return response
      .status(401)
      .json({ message: "No Token, Authorization Denied" });
  }

  const token = request.header("Authorization").replace("Bearer ", "");

  if (!token)
    return response
      .status(401)
      .json({ message: "No Token, Authorization Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.user = decoded;
    next();
  } catch (exception) {
    response.status(401).json({ message: "Token not Valid" });
  }
};
