const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("connectToDb");
  })
  .catch((error) => {
    console.log(error?.message || "Failed to Connect");
  });
