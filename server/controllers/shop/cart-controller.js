const { logger } = require("../../logger");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return logger({
        res,
        success: false,
        message: "Invalid data provided!",
        statusCode: 400,
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return logger({
        res,
        success: false,
        message: "Product not found!",
        statusCode: 400,
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity });
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
    }

    await cart.save();

    return logger({
      res,
      success: true,
      message: "Add to cart successfully",
      statusCode: 200,
    });
  } catch (error) {
    return logger({
      res,
      success: false,
      message: "Some error occured",
      statusCode: 500,
    });
  }
};

const updateToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return logger({
        res,
        success: false,
        message: "Invalid data provided!",
        statusCode: 400,
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return logger({
        res,
        success: false,
        message: "Cart not found",
        statusCode: 400,
      });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      return logger({
        res,
        success: false,
        message: "Cart item not present",
        statusCode: 404,
      });
    }

    cart.items[findCurrentProductIndex].quantity = quantity;

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    return logger({
      res,
      success: true,
      key: "data",
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
      message: "Get Cart Items successfully",
      statusCode: 200,
    });
  } catch (error) {
    return logger({
      res,
      success: false,
      message: "Some error occured",
      statusCode: 500,
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    if (!userId || !productId) {
      return logger({
        res,
        success: false,
        message: "Invalid data provided!",
        statusCode: 400,
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return logger({
        res,
        success: false,
        message: "Cart not found",
        statusCode: 400,
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    return logger({
      res,
      success: true,
      key: "data",
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
      message: "Get Cart Items successfully",
      statusCode: 200,
    });
  } catch (error) {
    console.log("error",error);
    return logger({
      res,
      success: false,
      message: "Some error occured",
      statusCode: 500,
    });
  }
};

const getCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return logger({
        res,
        success: false,
        message: "User id is manadatory!",
        statusCode: 400,
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return logger({
        res,
        success: false,
        message: "Cart not found",
        statusCode: 400,
      });
    }

    const validItems = cart.items.filter(
      (productItem) => productItem.productId
    );

    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populateCartItems = validItems.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    return logger({
      res,
      success: true,
      key: "data",
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
      message: "Get Cart Items successfully",
      statusCode: 200,
    });
  } catch (error) {
    console.log(error);
    return logger({
      res,
      success: false,
      message: "Some error occured",
      statusCode: 500,
    });
  }
};

module.exports = {
  addToCart,
  updateToCart,
  deleteCartItem,
  getCartItems,
};
