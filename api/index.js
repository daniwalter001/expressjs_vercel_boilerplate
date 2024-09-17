require("dotenv").config();
const express = require("express");
const app = express();
const fetch = require("node-fetch");

app
  .get("/manifest.json", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", "application/json");

    var json = {
      id: "daiki.uhdm.stream",
      version: "1.0.0",
      name: "UHDMovies",
      description: "From uhdmovie.dad",
      logo: "https://raw.githubusercontent.com/daniwalter001/daniwalter001/main/52852137.png",
      resources: [
        {
          name: "stream",
          types: ["movie", "series", "anime"],
          idPrefixes: ["tt", "kitsu"],
        },
      ],
      types: ["movie", "series", "anime", "other"],
      catalogs: [],
    };

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
