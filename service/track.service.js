const TrackModel = require("../model/TrackModel");
const scrape = require("./scrape.service");

const updateTrackPrices = async (res) => {
  try {
    const details = await TrackModel.find({});
    await scrape(details);
    res.send("Scraped");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { updateTrackPrices };
