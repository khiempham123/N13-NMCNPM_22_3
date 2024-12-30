const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String, required: true, unique: true }, // Added phone field
    token: { type: String }, // Added token field
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    salary: { type: Number },
    position: { type: String },
    role: { type: String, enum: ['staff', 'admin','customer'], required: true },
    // infoUser
    fullName: {
      type: String,
      default: "", // Mặc định là chuỗi rỗng
    },
    dateOfBirth: {
      type: String,
      default: "", // Mặc định là chuỗi rỗng
    },
    gender: {
      type: String,
      default: "", // Mặc định là chuỗi rỗng
    },
    avatar: {
      type: String,
      default:
        "https://tintuc.dienthoaigiakho.vn/wp-content/uploads/2024/01/c39af4399a87bc3d7701101b728cddc9.jpg", // URL của ảnh mặc định
    },
    address: {
      type: String,
      default: "", // Mặc định là chuỗi rỗng
    },
    refreshToken: { type: String, default: null },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const saltRounds = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema, "users");


module.exports = User;

