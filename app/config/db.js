const mongoose = require("mongoose");
// const { MONGO_DEV_URL } = process.env;
exports.connect = (url,options) => {
  mongoose
    .connect(url,options)
    .then((x) => {
      console.log(
        `Connected to Mongo! Database name: "${x.connections[0].name}"`
      );
    })
    .catch((err) => {
      console.error("Error connecting to mongo", err);
    });
};