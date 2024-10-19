const _ = require("lodash");

const User = require("../models/User");

const getFiledInfoData = ({ listFiled = [], object = {} }, isConvertId = false) => {
  const data = _.pick(object, listFiled);
  
  if (isConvertId&& data._id) {
    data.id = data._id;
    delete data._id;
  }
  
  return data;
};

const removeFiledInfoData = ({ listFiled = [], object = {} }) => {
  return _.omit(object, listFiled);
};

const findUser = async (query) => {
  return await User.findOne(query);
};

module.exports = { findUser, getFiledInfoData, removeFiledInfoData };
