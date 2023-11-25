const mongoose = require("mongoose");
const { updateTrackPrices } = require("../service/track.service");
require("dotenv").config();

mongoose.connect(process.env.MONGOURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
  updateTrackPrices();
});

module.exports = mongoose;
