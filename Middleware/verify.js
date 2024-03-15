import jwt from "jsonwebtoken";
import User from "./../Models/user.js";

export const requireSignin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user || !user.token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tokenIsValid = jwt.verify(user.token, process.env.JWT_SECRET);
    if (!tokenIsValid) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.userId = decoded.userId;
    next();
    // const authHeader = req.headers.authorization;
    // console.log("Authorization Header:", authHeader);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
