import jwt from "jsonwebtoken";

import config from "../config/config.js";
import Admin from "../models/admin.model.js";
import customerLoginValidationSchema from "../validations/customer.login.validations.js";

// JWT Token age
const JWT_MAX_AGE = "1d";

// Create token
const createToken = (admin) => {
  // Generate a JWT token
  const token = jwt.sign(
    { id: admin._id, role: admin.role },
    config.jwt_secret_key,
    {
      expiresIn: JWT_MAX_AGE,
    }
  );

  return token;
};

// Login Admin
const login = async (req, res) => {
  try {
    // Validate login info
    await customerLoginValidationSchema.validate(req.body, {
      abortEarly: true,
    });

    const { email, password } = req.body;

    const admin = await Admin.login(email, password);

    const token = createToken(admin);

    // Send the token as a cookie
    res.cookie("jwt_tkn", token, {
      httpOnly: true, // Accessible only by the web server, not JavaScript on the client-side
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "strict", // Helps prevent CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // Token expiration: 1 day
    });

    // Send a success message or user info (without password)
    res.json({
      message: "Login successful",
      admin: { id: admin._id, email: admin.email, role: admin.role, token },
    });
  } catch (error) {
    console.log(error, "Error while logging in admin");
    return res
      .status(500)
      .json({ message: "internal server error", error: error });
  }
};

export default login;
