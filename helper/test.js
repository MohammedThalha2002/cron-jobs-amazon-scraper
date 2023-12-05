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
      await page.waitForNavigation();
      await page.waitForXPath("//*[@id='SvgjsSvg1324']");
      let svgElement = await page.$eval("#SvgjsSvg1324", (el) => el.innerHTML);
      console.log();
    })
    .catch((err) => {
      console.log("error", err);
    });

  //   browser.close();

  res.send("image");
});
