const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    userId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
    isPrimary: Boolean,
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model("Address", AddressSchema);
module.exports = Address;