const Product = require("../../models/Product");
const { logger } = require("../../logger");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;

    if (!keyword || typeof keyword !== "string") {
      return logger({
        res,
        success: false,
        message: "Keyword is required and must be in string format",
        statusCode: 404,
      });
    }

    const regEx = new RegExp(keyword, "i");

    const createSearchQuery = {
      $or: [
        { title: regEx },
        { description: regEx },
        { category: regEx },
        { brand: regEx },
      ],
    };

    const searchResults = await Product.find(createSearchQuery);

    return logger({
      res,
      success: true,
      key: "data",
      data: searchResults,
      message: "",
      statusCode: 200,
    });
  } catch (error) {
    console.log("error", error);
    return logger({
      res,
      success: false,
      message: "Some error occured",
      statusCode: 500,
    });
  }
};

module.exports = { searchProducts };
