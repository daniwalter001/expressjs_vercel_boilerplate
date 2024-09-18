const providers = require("./assets/providers");
const { manifest, config } = require("./config");
const { parseRequest } = require("./helpers");
const { genres, categories, toClean, years, origins } = require("./utils");

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
    // manifest

    manifest.catalogs = [];

    //new
    manifest.catalogs.push({
      type: "movie",
      id: `${config.prefix}&id=top`,
      genres: [
        ...Object.values(genres),
        ...categories.map((el) => toClean(el)),
        ...Object.values(origins),
      ],
      extra: [
        {
          name: "genre",
          options: [
            ...Object.values(genres),
            ...categories.map((el) => toClean(el)),
            ...Object.values(origins),
          ],
        },
        { name: "search" },
        { name: "skip" },
      ],
      extraSupported: ["search", "genre", "skip"],
      name: "All",
    });

    manifest.catalogs.push({
      type: "series",
      id: `${config.prefix}&id=top`,
      genres: [
        ...Object.values(genres),
        ...categories.map((el) => toClean(el)),
        ...Object.values(origins),
      ],
      extra: [
        {
          name: "genre",
          options: [
            ...categories.map((el) => toClean(el)),
            ...Object.values(genres),
            ...Object.values(origins),
          ],
        },
        { name: "search" },
        { name: "skip" },
      ],
      extraSupported: ["search", "genre", "skip"],
      name: "All",
    });

    //new
    manifest.catalogs.push({
      type: "movie",
      id: `${config.prefix}&id=new`,
      genres: [...years],
      extra: [
        {
          name: "genre",
          options: [...years],
        },
        { name: "search" },
        { name: "skip" },
      ],
      extraSupported: ["search", "genre", "skip"],
      name: "New",
    });

    manifest.catalogs.push({
      type: "series",
      id: `${config.prefix}&id=new`,
      genres: [
        ...Object.values(genres),
        ...categories.map((el) => toClean(el)),
      ],
      extra: [
        {
          name: "genre",
          options: [
            ...Object.values(genres),
            ...categories.map((el) => toClean(el)),
          ],
        },
        { name: "search" },
        { name: "skip" },
      ],
      extraSupported: ["search", "genre", "skip"],
      name: "New",
    });

    //providers

    providers.forEach((provider) => {
      manifest.catalogs.push({
        type: "movie",
        id: `${config.prefix}&id=${provider.provider_id}`,
        genres: [
          ...Object.values(genres),
          ...categories.map((el) => toClean(el)),
          ...Object.values(origins),
        ],
        extra: [
          {
            name: "genre",
            options: [
              ...Object.values(genres),
              ...categories.map((el) => toClean(el)),
              ...Object.values(origins),
            ],
          },
          { name: "search" },
          { name: "skip" },
        ],
        extraSupported: ["search", "genre", "skip"],
        name: provider.provider_name,
      });

      manifest.catalogs.push({
        type: "series",
        id: `${config.prefix}&id=${provider.provider_id}`,
        genres: [
          ...Object.values(genres),
          ...categories.map((el) => toClean(el)),
          ...Object.values(origins),
        ],
        extra: [
          {
            name: "genre",
            options: [
              ...Object.values(genres),
              ...categories.map((el) => toClean(el)),
              ...Object.values(origins),
            ],
          },
          { name: "search" },
          { name: "skip" },
        ],
        extraSupported: ["search", "genre", "skip"],
        name: provider.provider_name,
      });
    });

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
