const express = require("express");
const router = express.Router();
const cheerio = require("cheerio");
const { axios } = require("axios");
const puppeteer = require("puppeteer");

router.post("/", async (req, res) => {
  let url = body.url;
  let email = body.email;
  let exp_price = body.exp_price;

  try {
    getHTML(url).then((html) => {
      const $ = cheerio.load(html);
      let title = $("#productTitle").text();
      let features = [];
      $("#feature-bullets>ul>li").each((i, desc) => {
        if (i < 2) {
          features.push($(desc).text().trim());
        }
      });
      let imgUrl = $("#imgTagWrapperId>img").attr("src");
      let curr_price = $(".a-price-whole").text();
      curr_price = curr_price.replace(/,/g, "");
      curr_price = parseInt(curr_price);
      let inStock = $("#availability>span").text().trim();
      let rating = $("#acrPopover>span>a>span").text().trim();

      const data = {
        url: url,
        title: title.trim(),
        features: features,
        imgUrl: imgUrl,
        curr_price: curr_price,
        inStock: inStock == "In stock" ? true : false,
        rating: parseFloat(rating),
      };

      res.send(data);
    });
  } catch (error) {
    res.send("error");
  }
});

const getHTML = async (url) => {
  const { data: html } = await axios.get(url);
  return html;
};

router.post("/get-svg-graph", async (req, res) => {
  const body = {
    url: "https://www.amazon.in/ASUS-Vivobook-i5-1335U-Fingerprint-X1504VA-NJ524WS/dp/B0C1GGJCSF/?_encoding=UTF8&pd_rd_w=V3VK1&content-id=amzn1.sym.523d54b6-5e5c-494d-84b4-ef78b981528e&pf_rd_p=523d54b6-5e5c-494d-84b4-ef78b981528e&pf_rd_r=67K19KTA68HNJYZTM01D&pd_rd_wg=Lrdgr&pd_rd_r=ecfb57cf-a711-4dc9-9389-6952700beaeb&ref_=pd_gw_deals_4s_t1",
    exp_price: 55000,
    curr_price: 50000,
    email: "mohammedthalha2209@gmail.com",
  };

  let browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  });

  const page = await browser.newPage();

  const url = "https://pricehistoryapp.com/";
  await page.goto(url);
  var inputElement = page.waitForXPath(
    "//*[@id='__next']/div[2]/section[2]/div/input"
  );
  await inputElement
    .then(async (input) => {
      await input.type(body.url);
      await input.press("Enter");
      await page.waitForNavigation().then(async (r) => {
        console.log(page.url());
        let svgElement = await page.$eval(
          "#apexchartspriceHistory",
          (el) => el.innerHTML
        );
        res.send({ data: svgElement });
      });
    })
    .catch((err) => {
      console.log("error", err);
      res.send("error");
    });
  browser.close();
});

module.exports = router;
