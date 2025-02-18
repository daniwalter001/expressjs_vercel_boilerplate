require("dotenv").config();
const express = require("express");
const app = express();
const { manifest } = require("../config");
const CatalogAddon = require("../controller");

app
  .get("/manifest.json", CatalogAddon.handleManifest)
  .get("/catalog/:type/:id.json", CatalogAddon.handleCollection)
  .get("/catalog/:type/:id/:extra.json", CatalogAddon.handleCollection)
  .get("/meta/:type/:id.json", CatalogAddon.handleMeta)
  .get("/stream/:type/:id.json", CatalogAddon.handleStream)
  .listen(process.env.PORT || 3000, () => {
    console.log("The server is working on " + process.env.PORT || 3000);
  });

module.exports = app;
