const { manifest } = require("./config");
const { parseRequest } = require("./helpers");

class CatalogAddon {
  /**
   *  Handle manifest
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns
   */
  static handleManifest(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", "application/json");
    var json = { ...manifest };
    return res.send(json);
  }

  /**
   *  Handle Catalog
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns
   */
  static handleCatalog(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", "application/json");

    const { type, id, skip, genre } = parseRequest(req);

    console.log({ type, id, skip, genre });

    return res.send({ metas: [] });
  }

  /**
   *  Handle Metadata
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns
   */
  static handleMeta(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", "application/json");

    const { type, id, skip, genre } = parseRequest(req);

    return res.send({ meta: [] });
  }

  /**
   *  Handle Streams
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns
   */
  static handleStram(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", "application/json");

    const { type, id, skip, genre } = parseRequest(req);
    console.log({ type, id, skip, genre });

    return res.send({ meta: [] });
  }
}

module.exports = CatalogAddon;
