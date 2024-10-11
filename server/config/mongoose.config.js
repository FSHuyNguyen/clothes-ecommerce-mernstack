const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGOOSE_URL)
  .then(() => console.log("MongoDb Connected"))
  .catch((error) => console.log("Error ", error));
