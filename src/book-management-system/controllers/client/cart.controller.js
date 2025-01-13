const Cart = require("../../models/cart.models.js");

const getCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const cart = await Cart.findOne({ userId }).populate("items.bookId");

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: "Giỏ hàng trống" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy giỏ hàng." });
  }
};

const updateCartItemQuantity = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    const item = cart.items.find((item) => item._id.toString() === itemId);

    if (!item) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
    }

    item.quantity = quantity;
    item.totalPrice = item.quantity * item.price;

    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

    await cart.save();
    res
      .status(200)
      .json({ message: "Số lượng sản phẩm đã được cập nhật", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi cập nhật số lượng sản phẩm." });
  }
};

const removeCartItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
    }

    cart.items.splice(itemIndex, 1);

    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

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
