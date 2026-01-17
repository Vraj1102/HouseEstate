import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyAdmin = (req, res, next) => {
  const token = req.cookies.admin_token;

  if (!token) return next(errorHandler(401, "Admin access required"));

  jwt.verify(token, process.env.JWT_SECRET, (err, admin) => {
    if (err) return next(errorHandler(403, "Invalid admin token"));

    req.admin = admin;
    next();
  });
};

export const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin.permissions[permission]) {
      return next(errorHandler(403, `${permission} permission required`));
    }
    next();
  };
};