const config = {
  id: "strm.daiki.tmdb_ctlg",
  prefix: "tmdb_ctlg.addon",
  version: "1.0.0",
  name: "Catalog Vercel",
  description: "From Catalog Vercel",
  logo: "https://raw.githubusercontent.com/daniwalter001/daniwalter001/main/52852137.png",
  cdn_path: "https://image.tmdb.org/t/p/original",
  authorization:
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NTI2OTQxOTM1ZDdkNmZhNTU4MDMwYjhiMzRjOGJiOCIsInN1YiI6IjY1MGZlZmQ1ZTFmYWVkMDBhZTMwMDVhYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RF4RBtcPvp4wipQ5aGUZObcur6FQRuvLwOtd1URZ36o", // Tmdb Access Token Auth
};

const manifest = {
  id: config.id,
  version: config.version,
  name: config.name,
  description: config.description,
  logo: config.logo,
  resources: [
    "catalog",
    "addon_catalog",
    {
      name: "meta",
      types: ["series", "movie"],
      idPrefixes: ["tt", config.prefix],
    },
  ],
  types: ["movie", "series"],

  behaviorHints: {
    newEpisodeNotifications: true,
  },
  catalogs: [],
};

module.exports = { config, manifest };
