const paypal = require("../../config/paypal.config");
const Order = require("../../models/Order");
const { logger } = require("../../logger");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: process.env.PAYPAL_REDIRECT_RETURN_URL,
        cancel_url: process.env.PAYPAL_REDIRECT_CANCEL_URL,
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          description: "description",
        },
      ],
    };

    paypal.payment.create(
      create_payment_json,
      async function (error, paymentInfo) {
        if (error) {
          return logger({
            res,
            success: false,
            message: "Some error occured",
            statusCode: 500,
          });
        } else {
          const newLyCreatedOrder = new Order({
            userId,
            cartId,
            cartItems,
            addressInfo,
            orderStatus,
            paymentMethod,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdateDate,
            paymentId,
            payerId,
          });

          await newLyCreatedOrder.save();

          const approvalURL = paymentInfo.links.find(
            (link) => link.rel === "approval_url"
          ).href;

          return logger({
            res,
            success: true,
            key: "data",
            data: {
              approvalURL,
              orderId: newLyCreatedOrder._id,
            },
            message: "Order Successfully",
            statusCode: 201,
          });
        }
      }
    );
  } catch (e) {
    return logger({
      res,
      success: false,
      message: "Some error occured",
      statusCode: 500,
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return logger({
        res,
        success: false,
        message: "Order can not be found",
        statusCode: 404,
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    for(let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if(!product) {
        return logger({
          res,
          success: false,
          message: `Not enough stock for this product ${product.title}`,
          statusCode: 400,
        });
      }

      product.totalStock -= item.quantity

      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    return logger({
      res,
      success: true,
      key: "data",
      data: order,
      message: "Order confirmed",
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

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return logger({
        res,
        success: false,
        message: "No orders found",
        statusCode: 404,
      });
    }

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

const getOrderDetails = async (req, res) => {
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

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
