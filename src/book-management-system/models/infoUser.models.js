const mongoose = require("mongoose");
const infoUserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    avatar: {
      type: String,
      required: true,
      default:
        "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/default-avatar.jpg", 
    },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { collection: "infoUser" },
  { timestamps: true }
);

const InfoUser = mongoose.model("InfoUser", infoUserSchema, "infoUser");

module.exports = InfoUser;
