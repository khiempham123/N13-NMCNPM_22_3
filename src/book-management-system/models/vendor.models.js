const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    vendor: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }], // liên kết với Book model
    thumbnail: { type: String }, // thêm thuộc tính hình ảnh
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);

// const vendors = [
//   {
//     vendor: "The Book Haven",
//     address: "123 Main St, District 1, HCMC",
//     phoneNumber: "+84 123 456 789",
//     rating: 4.5,
//     books: [
//       "67389c81d0dbf8067199703f",
//       "67389c81d0dbf80671997040",
//       "67389c81d0dbf80671997041",
//     ],
//     thumbnail:
//       "https://demo2.pavothemes.com/bookory/wp-content/uploads/2022/11/store-7.jpg",
//   },
//   {
//     vendor: "Read & Relax",
//     address: "456 Nguyen Trai, District 5, HCMC",
//     phoneNumber: "+84 987 654 321",
//     rating: 3.8,
//     books: ["67389c81d0dbf8067199703f", "67389c81d0dbf80671997040"],

//     thumbnail:
//       "https://demo2.pavothemes.com/bookory/wp-content/uploads/2022/11/store-8.jpg",
//   },
//   {
//     vendor: "Novel Nook",
//     address: "789 Le Loi, District 3, HCMC",
//     phoneNumber: "+84 234 567 890",
//     rating: 4.2,
//     books: [
//       "67389c81d0dbf8067199703f",
//       "67389c81d0dbf80671997040",
//       "67389c81d0dbf80671997041",
//     ],

//     thumbnail:
//       "https://demo2.pavothemes.com/bookory/wp-content/uploads/2022/11/store-9.jpg",
//   },
//   {
//     vendor: "Page Turners",
//     address: "101 Tran Hung Dao, District 10, HCMC",
//     phoneNumber: "+84 345 678 901",
//     rating: 4.7,
//     books: ["67389c81d0dbf8067199703f", "67389c81d0dbf80671997040"],

//     thumbnail:
//       "https://demo2.pavothemes.com/bookory/wp-content/uploads/2022/11/store-5.jpg",
//   },
//   {
//     vendor: "Bookworm Corner",
//     address: "202 Pham Ngoc Thach, District 1, HCMC",
//     phoneNumber: "+84 456 789 012",
//     rating: 4.0,
//     books: ["67389c81d0dbf8067199703f", "67389c81d0dbf80671997040"],

//     thumbnail:
//       "https://demo2.pavothemes.com/bookory/wp-content/uploads/2022/11/cropped-store-3.jpg",
//   },
//   {
//     vendor: "Story Street",
//     address: "303 Bui Thi Xuan, District 2, HCMC",
//     phoneNumber: "+84 567 890 123",
//     rating: 4.6,
//     books: ["67389c81d0dbf8067199703f", "67389c81d0dbf80671997040"],

//     thumbnail:
//       "https://demo2.pavothemes.com/bookory/wp-content/uploads/2022/11/store-1.jpg",
//   },
// ];

// module.exports = vendors;
