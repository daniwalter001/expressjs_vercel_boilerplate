require("dotenv").config();
const express = require("express");
const app = express();
const { manifest } = require("../config");
const fetch = require("node-fetch");

app
  .get("/manifest.json", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", "application/json");

    var json = { ...manifest };

    return res.send(json);
  })
  .get("/stream/:type/:id", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", "application/json");

    return res.send({ streams: [] });
  })
  .listen(process.env.PORT || 3000, () => {
    console.log("The server is working on " + process.env.PORT || 3000);
  });

module.exports = app;
