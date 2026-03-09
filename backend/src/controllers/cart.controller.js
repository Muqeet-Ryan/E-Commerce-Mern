import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } });
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === product.id,
      );
      return { ...product.toJSON(), quantity: item.quantity };
    });
    return res.status(200).json(cartItems);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user;
    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }
    await user.save();
    return res.status(200).json(user.cartItems);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    if (productId) {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }
    await user.save();
    return res.status(200).json(user.cartItems);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
};

export const updateCartQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    const existingItem = user.cartItems.find((item) => item.id === productId);

    if (!existingItem) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    if (quantity === 0) {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    } else {
      existingItem.quantity = quantity;
    }

    await user.save();

    res.json(user.cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};
