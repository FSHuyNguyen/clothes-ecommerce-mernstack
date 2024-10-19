const { logger } = require("../../logger");
const Order = require("../../models/Order");

const getAllOrdersOfAllUser = async (req, res) => {
  try {
    const orders = await Order.find({});
    return logger({
      res,
      success: true,
      key: "data",
      data: orders,
      message: "Get Orders Users successfully",
      statusCode: 200,
    });
  } catch (e) {
    console.log(e);
    return logger({
      res,
      success: false,
      message: "Some error occured",
      statusCode: 500,
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return logger({
        res,
        success: false,
        message: "Order not found",
        statusCode: 404,
      });
    }

    return logger({
      res,
      success: true,
      key: "data",
      data: order,
      message: "Get Orders Details successfully",
      statusCode: 200,
    });
  } catch (e) {
    console.log(e);
    return logger({
      res,
      success: false,
      message: "Some error occured",
      statusCode: 500,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return logger({
        res,
        success: false,
        message: "Order not found",
        statusCode: 400,
      });
    }

    await Order.findByIdAndUpdate(id, { orderStatus });

    return logger({
      res,
      success: true,
      message: "Order status is updated successfully!",
      statusCode: 200,
    });
  } catch (e) {
    console.log(e);
    return logger({
      res,
      success: false,
      message: "Some error occured",
      statusCode: 500,
    });
  }
};

module.exports = {
  getAllOrdersOfAllUser,
  getOrderDetailsForAdmin,
  updateOrderStatus,
};
