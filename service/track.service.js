const TrackModel = require("../model/TrackModel");
const { scrape } = require("./scrape.service");

const updateTrackPrices = async () => {
  try {
    const details = await TrackModel.find({});
    await scrape(details);
    res.send(details);
  } catch (error) {
    res
      .status(400)
      .json({ msg: "Failed to fetch the tracking data", error: error });
  }
};

module.exports = { updateTrackPrices };
