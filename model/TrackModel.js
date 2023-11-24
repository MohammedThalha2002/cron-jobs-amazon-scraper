const mongoose = require("mongoose");

const TrackSchema = mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  exp_price: {
    type: Number,
    required: true,
  },
  curr_price: {
    type: Number,
    required: true,
    default: 0,
  },
  email: {
    type: String,
    required: true,
  },
});

const Track = mongoose.model("Track", TrackSchema);

module.exports = Track;
