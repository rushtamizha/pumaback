import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    req.admin = admin; // attach admin data for further use
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};
