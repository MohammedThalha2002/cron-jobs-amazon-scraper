const TrackModel = require("../model/TrackModel");
const { scrape } = require("./scrape.service");

const updateTrackPrices = async () => {
  try {
    const details = await TrackModel.find({});
    await scrape(details);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { updateTrackPrices };
