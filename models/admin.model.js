import mongoose from "mongoose";

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

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
