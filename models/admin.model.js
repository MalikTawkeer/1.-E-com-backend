import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    min: 8,
  },

  role: {
    type: String,
    enum: ["super_admin", "admin"],
    default: "admin",
  },

  //   References to products collection
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

// Login Admin
adminSchema.statics.login = async function (email, password) {
  try {
    // Check if the user exists
    const admin = await this.findOne({ email });
    if (!admin) {
      throw "Incorrect email";
    }

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw "Incorrect email or password";
    }

    // Return the user if login is successful
    return admin;
  } catch (error) {
    throw error;
  }
};

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
