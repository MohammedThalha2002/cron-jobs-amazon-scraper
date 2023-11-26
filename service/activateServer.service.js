const { default: axios } = require("axios");

async function activateServer() {
  axios
    .get("https://amazon-scraper-1etb.onrender.com/")
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
}

module.exports = { activateServer };
