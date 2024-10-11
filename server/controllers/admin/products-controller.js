const { imageUpload } = require("../../config/cloudinary.config");
const { logger } = require("../../logger");
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");

    const url = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await imageUpload(url);

    return logger({
      res,
      success: true,
      data: result,
      key: "data",
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

// Create Product
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    const newProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    });

    await newProduct.save();
    return logger({
      res,
      success: true,
      data: newProduct,
      message: "Created new Product successfully",
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

// Update Product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    let findProduct = await Product.findById(id);
    if (!findProduct) {
      return logger({
        res,
        success: false,
        message: "Product not found",
        statusCode: 404,
      });
    }

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice =
      salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.image = image || findProduct.image;

    await findProduct.save();
    return logger({
      res,
      success: true,
      data: findProduct,
      message: "Update product successfully",
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

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return logger({
        res,
        success: false,
        message: "Product not found",
        statusCode: 404,
      });
    }

    return logger({
      res,
      success: true,
      message: "Delete product successfully",
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

// Get All Product
const getAllProduct = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});

    return logger({
      res,
      success: true,
      key: "data",
      data: listOfProducts,
      message: "Get list of products successfully",
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

// Get detail Product
const getDetailProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const findProduct = await Product.findById(id);

    if (!findProduct) {
      return logger({
        res,
        success: false,
        message: "Product not found",
        statusCode: 404,
      });
    }

    return logger({
      res,
      success: true,
      data: findProduct,
      message: "Detail product",
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

module.exports = {
  handleImageUpload,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getDetailProduct,
};
