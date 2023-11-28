const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const { updateTrackPrices } = require("./service/track.service");
const { default: axios } = require("axios");
const UserModel = require("./model/UserModel");
require("./config/db");

const app = express();

const PORT = 3000;

app.use(cors());

// cron.schedule(
//   "0 */3 * * *",
//   function () {
//     console.log("---------------------");
//     console.log("Updating tracking prices on every 3 hours");
//     updateTrackPrices();
//   },
//   {
//     scheduled: true,
//     timezone: "Asia/Kolkata",
//   }
// );

app.get("/start", async (req, res) => {
  await updateTrackPrices();
  res.send("scraped...");
});

app.get("/bot-check", async (req, res) => {
  const body = {
    url: "https://www.amazon.in/ASUS-Vivobook-i5-1335U-Fingerprint-X1504VA-NJ524WS/dp/B0C1GGJCSF/?_encoding=UTF8&pd_rd_w=V3VK1&content-id=amzn1.sym.523d54b6-5e5c-494d-84b4-ef78b981528e&pf_rd_p=523d54b6-5e5c-494d-84b4-ef78b981528e&pf_rd_r=67K19KTA68HNJYZTM01D&pd_rd_wg=Lrdgr&pd_rd_r=ecfb57cf-a711-4dc9-9389-6952700beaeb&ref_=pd_gw_deals_4s_t1",
    exp_price: 55000,
    curr_price: 50000,
    email: "mohammedthalha2209@gmail.com",
  };

  let email = body.email;

  let user = await UserModel.find({
    email: email,
  });
  user = user[0];
  console.log(user);
  let userId = user.userId;
  let token = user.token;

  axios
    .post(
      `https://cliq.zoho.com/company/${userId}/api/v2/bots/amazontracker/incoming?zapikey=${token}`,
      body
    )
    .then((res) => res.send(res.data))
    .catch((err) => res.send(err));
});

app.listen(PORT, () => {
  console.log(`Listening to the PORT : ` + PORT);
});
