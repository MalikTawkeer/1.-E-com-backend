import Admin from "../models/admin.model.js";
import User from "../models/customer/customer.model.js";

const authorize = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return async (req, res, next) => {
    // Check admin in req
    if (roles?.includes === "admin") {
      if (!req.admin)
        // Check if Admin exists
        return res.sendStatus(403); // Forbidden if user not authenticated
    }

    // Check user in req
    if (!req.user) {
      // Check if user exists
      return res.sendStatus(403); // Forbidden if user not authenticated
    }

    try {
      // Check for admin role
      if (req.user.role === "admin") {
        const admin = await Admin.findById(req.user._id);
        if (!admin) {
          return res.sendStatus(403); // Forbidden if admin not found
        }
      }
      // Check for user role
      else if (req.user.role === "customer") {
        const user = await User.findById(req.user._id);
        if (!user) {
          return res.sendStatus(403); // Forbidden if user not found
        }
      }
      // If the user's role is not valid
      else {
        return res.sendStatus(403); // Forbidden if role is invalid
      }

      // Check if the user's role is authorized
      if (!roles.includes(req.user.role)) {
        return res.sendStatus(403); // Forbidden if user does not have the required role
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      return res.sendStatus(500); // Internal server error
    }
  };
};

export default authorize;
