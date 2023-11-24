const puppeteer = require("puppeteer");
const TrackModel = require("../model/TrackModel");
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
  const priceGet = await page.$eval(tag, (el) => el.textContent);
  console.log(priceGet);
  const orgPriceStr = priceGet.replace(/,/g, "");
  const price = parseInt(orgPriceStr);
  // update the price details in db
  updatePriceDetails(detail._id, price);
}

async function updatePriceDetails(id, curr_price) {
  try {
    await TrackModel.findByIdAndUpdate(id, {
      $set: {
        curr_price: curr_price,
      },
    });
    console.log(curr_price, "updated successfully");
  } catch (err) {
    console.log(err);
  }
}

module.exports = { scrape };
