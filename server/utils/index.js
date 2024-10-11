const _ = require("lodash");

const User = require("../models/User");

const getFiledInfoData = ({ listFiled = [], object = {} }) => {
  return _.pick(object, listFiled);
};

const removeFiledInfoData = ({ listFiled = [], object = {} }) => {
  return _.omit(object, listFiled);
};

const findUser = async (query) => {
  return await User.findOne(query);
};

module.exports = { findUser, getFiledInfoData, removeFiledInfoData };
