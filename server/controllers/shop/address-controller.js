const { logger } = require("../../logger");
const Address = require('../../models/Address');

const addAddress = async (req, res) => {
  try {
    const { userId, address, city, pincode, phone, notes, isPrimary } = req.body;

    if (!userId || !address || !city || !pincode || !phone || !notes) {
      return logger({
        res,
        success: false,
        message: "Invalid data provided!",
        statusCode: 400,
      });
    }

    if(isPrimary) {
      await Address.findOneAndUpdate(
        { isPrimary: true },
        { $set: { isPrimary: false }},
      );
    }

    const newLyCreatedAddress = new Address({
      userId,
      address,
      city,
      pincode,
      phone,
      notes,
      isPrimary
    });

    await newLyCreatedAddress.save();

    return logger({
      res,
      success: true,
      key: "data",
      data: newLyCreatedAddress,
      message: "Address created successfully",
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

const getListAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return logger({
        res,
        success: false,
        message: "Invalid data provided!",
        statusCode: 400,
      });
    }

    const addressList = await Address.find({ userId });
    return logger({
      res,
      success: true,
      key: "data",
      data: addressList,
      message: "Get List Address successfully",
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

const updateAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body;

    if (!userId || !addressId) {
      return logger({
        res,
        success: false,
        message: "Invalid data provided!",
        statusCode: 400,
      });
    }

    if(req.body.isPrimary) {
      await Address.findOneAndUpdate(
        { isPrimary: true },
        { $set: { isPrimary: false }},
      );
    }

    const addressUpdated = await Address.findOneAndUpdate(
      {
        _id: addressId,
        userId,
      },
      formData,
      { new: true }
    );

    if (!addressUpdated) {
      return logger({
        res,
        success: false,
        message: "Address not found!",
        statusCode: 400,
      });
    }

    return logger({
      res,
      success: true,
      key: "data",
      data: addressUpdated,
      message: "Some error occured",
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

const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    if (!userId || !addressId) {
      return logger({
        res,
        success: false,
        message: "Invalid data provided!",
        statusCode: 400,
      });
    }

    const addressDeleted = await Address.findOneAndDelete({
      _id: addressId,
      userId,
    });

    if (!addressDeleted) {
      return logger({
        res,
        success: false,
        message: "Address not found!",
        statusCode: 400,
      });
    }

    return logger({
      res,
      success: true,
      message: "Deleted address successfully",
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

module.exports = { addAddress, getListAddress, updateAddress, deleteAddress };
