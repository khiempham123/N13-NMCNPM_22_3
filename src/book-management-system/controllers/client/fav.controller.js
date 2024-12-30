const Favorite = require("../../models/fav.models.js");

const getFav = async (req, res) => {
  const userId = req.user.id;

  try {
    // Tìm danh sách yêu thích của người dùng
    const fav = await Favorite.findOne({ userId }).populate("items.bookId");

    if (!fav) {
      return res.status(404).json({ message: "Danh sách yêu thích trống" });
    }

    // Trả về danh sách yêu thích với thông tin các sản phẩm
    res.status(200).json(fav);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách yêu thích." });
  }
};

const removeFavItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.id;

  try {
    // Tìm danh sách yêu thích của người dùng
    const fav = await Favorite.findOne({ userId });

    if (!fav) {
      return res
        .status(404)
        .json({ message: "Danh sách yêu thích không tồn tại" });
    }

    // Tìm và xóa sản phẩm khỏi danh sách yêu thích
    const itemIndex = fav.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không tồn tại trong danh sách yêu thích" });
    }

    // Xóa sản phẩm
    fav.items.splice(itemIndex, 1);

    // Lưu lại danh sách yêu thích sau khi xóa sản phẩm
    await fav.save();
    res
      .status(200)
      .json({ message: "Sản phẩm đã được xóa khỏi danh sách yêu thích", fav });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Lỗi khi xóa sản phẩm khỏi danh sách yêu thích." });
  }
};

module.exports = {
  getFav,
  removeFavItem,
};
