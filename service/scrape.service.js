const puppeteer = require("puppeteer");
const TrackModel = require("../model/TrackModel");
const { default: axios } = require("axios");
const UserModel = require("../model/UserModel");
require("dotenv").config();

async function scrape(details) {
  console.log("Scraping started");
  let browser;
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    browser = await puppeteer.launch({
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    });
  } else {
    browser = await puppeteer.launch({ headless: "new" });
  }
  const page = await browser.newPage();
  for (const detail of details) {
    await findPrice(page, detail);
  }
  browser.close();
}

async function findPrice(page, detail) {
  console.log(detail.url);
  await page.goto(detail.url);
  tag = ".a-price-whole";

  try {
    const priceGet = await page.$eval(tag, (el) => el.textContent);
    const orgPriceStr = priceGet.replace(/,/g, "");
    let price = parseInt(orgPriceStr);
    console.log("New price", price);
    // update the price details in db
    // dont update if same price exists
    if (price != detail.curr_price) {
      await updatePriceDetails(detail._id, price);
    } else {
      console.log("same price");
    }
    // check if the curr price is less than the expected price to notify the person
    if (price <= detail.exp_price) {
      // notify the user on the price drop
      const body = {
        id: detail._id,
        url: detail.url,
        exp_price: detail.exp_price,
        curr_price: price,
        email: detail.email,
      };
      notifyUser(body);
    }
  } catch (error) {
    console.log(error);
  }
}

async function updatePriceDetails(id, curr_price) {
  try {
    await TrackModel.findByIdAndUpdate(id, {
      $set: {
        curr_price: curr_price,
      },
    });
    console.log(curr_price, "price updated successfully");
  } catch (err) {
    console.log(err);
  }
}

async function notifyUser(body) {
  // find user using email
  let email = body.email;

  const user = await UserModel.find({
    email: email,
  });
  console.log(user);
  let userId = user[0].userId;
  let token = user[0].token;

  axios
    .post(
      `https://cliq.zoho.com/company/${userId}/api/v2/bots/amazontracker/incoming?zapikey=${token}`,
      body
    )
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err?.response?.data));
}

module.exports = { scrape };
