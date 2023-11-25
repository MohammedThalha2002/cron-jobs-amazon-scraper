const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
require("./config/db");

const app = express();

const PORT = 3000;

app.use(cors());

app.listen(PORT, () => {
  console.log(`Listening to the PORT : ` + PORT);
});
