const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    gender: { type: String, required: true },
    position: { type: String, required: true },
    salary: { type: String, required: true },
    avatar: { type: String, required: true },
  },
  { timestamps: true }
);

const Staff = mongoose.model("Staff", staffSchema);

module.exports = Staff;
