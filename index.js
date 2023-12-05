const express = require("express");
const cors = require("cors");
const { default: axios } = require("axios");
require("./config/db");
const { updateTrackPrices } = require("./service/track.service");
const UserModel = require("./model/UserModel");
const cron = require("node-cron");
const router = require("./router/routes");

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());
//
// cron.schedule(
//   "0 */1 * * *",
//   async function () {
//     console.log("---------------------");
//     console.log("Updating tracking prices on every 3 hours");
//     await updateTrackPrices();
//   },
//   {
//     scheduled: true,
//     timezone: "Asia/Kolkata",
//   }
// );

app.use("/post", router);

app.get("/start", async (req, res) => {
  try {
    await updateTrackPrices(res);
  } catch (error) {
    res.send(error);
  }
});

app.get("/bot-check", async (req, res) => {
  const body = {
    _id: "656afe4f1cbed8039eb09ed4",
    url: "https://www.amazon.in/boAt-Rockerz-245-Pro-Interface/dp/B0CC8SBFFR/ref=sr_1_5?crid=9G5BMKWGINVB&keywords=neckband%2Bearphones&qid=1701510020&sprefix=neckan%2Caps%2C319&sr=8-5&th=1",
    title:
      "boAt Rockerz 245 v2 Pro Wireless Neckband with Up to 30 hrs Playtime",
    features: [
      "Long Playtime: Watch your comfort movies and web series on repeat with the boAt Rockerz 245V2 Pro Neckband Earphones. Lending up to 30 hours of performance, these earphones are the perfect audio accessory for heightened relaxation.",
      "boAt Signature Sound: Engage yourself in rich bass and high treble while grooving to the latest tracks in your car or at the gym or cafe. Powerful 10 mm drivers pump out balanced boAt Signature Sound, making these earphones a delight for music lovers.",
    ],
    imgUrl:
      "https://m.media-amazon.com/images/I/41LFgylW-WL._SX300_SY300_QL70_ML2_.jpg",
    inStock: true,
    rating: 3.9,
    exp_price: 1002,
    curr_price: 1098,
    email: "mohammedthalha2209@gmail.com",
    __v: 0,
    track_enabled: true,
  };

  let email = body.email;

  let user = await UserModel.find({
    email: email,
  });
  user = user[0];
  console.log(user);
  let userId = user.userId;
  let token = user.token;
  // let token =
  //   "1001.f60094bfff22038c6180d69b16c6cf4d.6d7ab047b74ed0c6d11373f4adbb9b6a";

  // axios
  //   .post(
  //     `https://cliq.zoho.com/company/${userId}/api/v2/bots/amazontracker/incoming?zapikey=${token}`,
  //     body
  //   )
  //   .then((res) => res.send(res.data))
  //   .catch((err) => res.send(err));
  const sandbox = `https://cliq.zoho.com/company/${userId}/api/v2/applications/2305843009213699174/incoming?appkey=sbx-NTIyMy0yNDAxZDViMi02YTVhLTQyZGUtOWNhYy1hNDc0NDg2NzU5M2Q=`;
  await axios
    .post(`${sandbox}&zapikey=${token}`, body)
    .then((result) => res.send(result.data))
    .catch((err) => res.send(err));
});

app.listen(PORT, () => {
  console.log(`Listening to the PORT : ` + PORT);
});
