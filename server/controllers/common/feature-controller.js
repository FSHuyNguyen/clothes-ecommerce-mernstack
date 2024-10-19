const Feature = require("../../models/Feature");
const { logger } = require("../../logger");

const addFeatureImages = async (req, res) => {
  try {
    const { image } = req.body;

    if(!image) {
      return logger({
        res,
        success: false,
        message: "Image not empty",
        statusCode: 400,
      });
    }

    const featuresImages = new Feature({
      image,
    });

    await featuresImages.save();

    return logger({
      res,
      success: true,
      key: 'data',
      data: featuresImages,
      message: "Add Feature Images Successfully",
      statusCode: 201,
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

const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({});

    return logger({
      res,
      success: true,
      key: 'data',
      data: images,
      message: "Get Feature Image Successfully",
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

module.exports = { addFeatureImages, getFeatureImages };
