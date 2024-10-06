import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },

  caption: {
    type: String,
    default: "",
  },
});

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;
