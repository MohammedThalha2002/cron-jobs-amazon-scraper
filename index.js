const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const { updateTrackPrices } = require("./service/track.service");
require("./config/db");

const app = express();

const PORT = 3000;

app.use(cors());

cron.schedule(
  "0 */3 * * *",
  function () {
    console.log("---------------------");
    console.log("Updating tracking prices on every 3 hours");
    updateTrackPrices();
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

app.listen(PORT, () => {
  console.log(`Listening to the PORT : ` + PORT);
});
