const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const { updateTrackPrices } = require("./service/track.service");
const { activateServer } = require("./service/activateServer.service");
const { default: axios } = require("axios");
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

cron.schedule(
  "0 */1 * * *",
  function () {
    console.log("---------------------");
    console.log("Server Activating");
    activateServer();
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

app.get("/fake-req", (req, res) => {
  const body = {
    url: "https://www.amazon.in/ASUS-Vivobook-i5-1335U-Fingerprint-X1504VA-NJ524WS/dp/B0C1GGJCSF/?_encoding=UTF8&pd_rd_w=V3VK1&content-id=amzn1.sym.523d54b6-5e5c-494d-84b4-ef78b981528e&pf_rd_p=523d54b6-5e5c-494d-84b4-ef78b981528e&pf_rd_r=67K19KTA68HNJYZTM01D&pd_rd_wg=Lrdgr&pd_rd_r=ecfb57cf-a711-4dc9-9389-6952700beaeb&ref_=pd_gw_deals_4s_t1",
    exp_price: 55000,
    curr_price: 50000,
    email: "mohammedthalha2209@gmail.com",
  };
  axios
    .post(
      "https://cliq.zoho.com/company/834928503/api/v2/bots/amazontracker/incoming?zapikey=1001.f60094bfff22038c6180d69b16c6cf4d.6d7ab047b74ed0c6d11373f4adbb9b6a",
      body
    )
    .then((res) => res.send(res.data))
    .catch((err) => res.send(err));
});

app.listen(PORT, () => {
  console.log(`Listening to the PORT : ` + PORT);
});
