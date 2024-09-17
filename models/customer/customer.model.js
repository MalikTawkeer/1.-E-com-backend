import mongoose from "mongoose";
import bcrypt from "bcrypt";

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    min: [8, "password must be of 8 chars"],
  },

  role: {
    type: String,
    enum: ["user", "vip"],
    default: "user",
  },

  address: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: "CustomerAddress",
  },

  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomerOrder",
    },
  ],

  cart_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
});

// Register user
customerSchema.statics.register = async function (
  name,
  email,
  password,
  session = null
) {
  try {
    const existingUser = await this.findOne({ email });
    if (existingUser) throw "Email is alredy registered";

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await this({
      name,
      email,
      password: hashedPassword,
    });
    newUser.save({ session });

    return newUser;
    // check  existence
    // hash password
    // sotre into db
  } catch (error) {
    throw error;
  }
};

// Login user
customerSchema.statics.login = async function (email, password) {
  try {
    // Check if the user exists
    const user = await this.findOne({ email });
    if (!user) {
      throw "Incorrect email";
    }

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw "Incorrect email or password";
    }

    // Return the user if login is successful
    return user;
  } catch (error) {
    throw error;
  }
};

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
