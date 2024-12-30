const Cart = require("../../models/cart.models.js");

// lấy sách theo tk người dùng từ dtb

const getCart = async (req, res) => {
  const userId = req.user.id;
  try {
    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ userId }).populate("items.bookId");

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: "Giỏ hàng trống" });
    }

    // Trả về giỏ hàng với thông tin các sản phẩm
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy giỏ hàng." });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
const updateCartItemQuantity = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body; // Số lượng mới
  const userId = req.user._id;

  try {
    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    // Tìm sản phẩm trong giỏ hàng
    const item = cart.items.find((item) => item._id.toString() === itemId);

    if (!item) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
    }

    // Cập nhật số lượng và tính lại tổng giá trị sản phẩm
    item.quantity = quantity;
    item.totalPrice = item.quantity * item.price;

    // Cập nhật lại tổng tiền trong giỏ hàng
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

    // Lưu lại giỏ hàng
    await cart.save();
    res
      .status(200)
      .json({ message: "Số lượng sản phẩm đã được cập nhật", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi cập nhật số lượng sản phẩm." });
  }
};

// xóa
const removeCartItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  try {
    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    // Tìm và xóa sản phẩm khỏi giỏ hàng
    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
    }

    // Xóa sản phẩm
    cart.items.splice(itemIndex, 1);

    // Cập nhật lại tổng tiền trong giỏ hàng
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

    // Lưu lại giỏ hàng
    await cart.save();
    res
      .status(200)
      .json({ message: "Sản phẩm đã được xóa khỏi giỏ hàng", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi xóa sản phẩm khỏi giỏ hàng." });
  }
};

module.exports = {
  getCart,
  updateCartItemQuantity,
  removeCartItem,
};
