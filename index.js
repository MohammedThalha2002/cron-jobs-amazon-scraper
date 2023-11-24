const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const { updateTrackPrices } = require("./service/track.service");
require("./config/db");

const app = express();

const PORT = 3000;

app.use(cors());

cron.schedule(
  "0 0 */6 * * *",
  function () {
    console.log("---------------------");
    console.log("Updating tracking prices on every 6 hours");
    updateTrackPrices();
  },
  {
    timezone: "Asia/Kolkata",
  }
);

app.listen(PORT, () => {
  console.log(`Listening to the PORT : ` + PORT);
});
