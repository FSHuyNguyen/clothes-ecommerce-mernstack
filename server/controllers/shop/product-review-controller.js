const { logger } = require("../../logger");
const Order = require("../../models/Order");
const ProductReview = require("../../models/Review");
const Product = require("../../models/Product");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } =
      req.body;
    
    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      orderStatus: "confirmed",
    });

    if (!order) {
      return logger({
        res,
        success: false,
        message: "You need to purchase product to review it",
        statusCode: 400,
      });
    }

    const checkExistReview = await ProductReview.findOne({
      productId,
      userId,
    });

    if (checkExistReview) {
      return logger({
        res,
        success: false,
        message: "You already reviewed this product!",
        statusCode: 400,
      });
    }

    const newReview = new ProductReview({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });

    await newReview.save();

    const reviews = await ProductReview.find({ productId });
    const totalReviewsLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewsLength;

    await Product.findByIdAndUpdate(productId, { averageReview });

    return logger({
      res,
      success: true,
      key: "data",
      data: newReview,
      message: "Reviewed successfully",
      statusCode: 201,
    });
  } catch (e) {
    return logger({
      res,
      success: false,
      message: "Some error occured",
      statusCode: 500,
    });
  }
};

const getProductReview = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await ProductReview.find({ productId });

    return logger({
      res,
      success: true,
      key: "data",
      data: reviews,
      message: "",
      statusCode: 200,
    });
  } catch (e) {
    return logger({
      res,
      success: false,
      message: "Some error occured",
      statusCode: 500,
    });
  }
};

module.exports = { addProductReview, getProductReview };
