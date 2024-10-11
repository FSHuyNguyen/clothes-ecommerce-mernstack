const { logger } = require("../../logger");
const Product = require("../../models/Product");

const getFilteredProducts = async (req, res) => {
  try {
    const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;

    let filters = {};

    if (category.length > 0) {
      filters.category = { $in: category.split(",") };
    }

    if (brand.length > 0) {
      filters.brand = { $in: brand.split(",") };
    }

    let sort = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort.price = 1;
        break;
    }

    const products = await Product.find(filters).sort(sort);

    return logger({
      res,
      success: true,
      key: "data",
      data: products,
      message: "Get filtered products successfully",
      statusCode: 200,
    });
  } catch (err) {
    return logger({
      res,
      success: false,
      message: "Some error occured",
      statusCode: 500,
    });
  }
};

const getProductDetail = async (req, res) => {
  try {
      const  { id } = req.params;
      const product = await Product.findById(id);

      if(!product) {
        return logger({
          res,
          success: false,
          message: "Product not found",
          statusCode: 400,
        });
      }

      return logger({
        res,
        success: true,
        key: "data",
        data: product,
        message: "Detail Product Successfully",
        statusCode: 200,
      });
  } catch (e) {
    console.log("error", e);
    return logger({
      res,
      success: false,
      message: "Some error occured",
      statusCode: 500,
    });
  }
};

module.exports = { getFilteredProducts, getProductDetail };
