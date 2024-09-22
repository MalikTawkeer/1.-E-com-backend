import jwt from "jsonwebtoken";
import config from "../config/config.js";

import Admin from "../models/admin.model.js";
import User from "../models/customer/customer.model.js";

const authenticateJWT = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req?.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(403)
        .json({ message: "No Token provided or invalid format!!" }); // Check if Bearer token is present
    }

    // Extract the token (split on the space and take the second part)
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "No Token provided!!" }); // Return here to avoid further execution
    }

    // Verify the token
    const decoded = jwt.verify(token, config.jwt_secret_key);

    // Check if admin
    if (decoded?.role === "admin") {
      const admin = await Admin.findById(decoded?.id); // `findById` for correct MongoDB query
      if (!admin) {
        return res
          .status(403)
          .json({ message: "Access denied, Unknown admin!!" }); // Return to avoid next call
      }

      // Attach admin object to request
      req.user = admin; // You can use req.user for both admin and customer for consistency
      return next(); // Admin authenticated, proceed to the next middleware
    }

    // Check if user (customer)
    const user = await User.findById(decoded?.id);
    if (!user) {
      return res.status(403).json({ message: "Access denied, Unknown user!!" }); // Return to avoid next call
    }

    // Attach user object to the request
    req.user = user;

    // Check user role
    if (user.role !== "customer") {
      return res.status(403).json({ message: "Access denied, Invalid role!!" }); // Return to avoid next call
    }

    // Proceed to the next middleware if all checks pass
    next();
  } catch (err) {
    console.error("Something went wrong verifying token", err);
    return res.status(403).json({ error: "Token verification failed!" });
  }
};

export default authenticateJWT;
