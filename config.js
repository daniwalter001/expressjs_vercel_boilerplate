const config = {
  id: "strm.daiki.tmdb_cctlg2",
  prefix: "ctmdbl2",
  // prefix: "tmdb_ctlg.addon",
  version: "1.0.0",
  name: "Collection Catalog Vercel 2",
  description: "From Catalog Vercel for Collections",
  // logo: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*idLhmtcMdWeN-UMGR0ROjQ.png",
  logo: "https://pbs.twimg.com/profile_images/1243623122089041920/gVZIvphd_400x400.jpg",
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
      types: ["movie", "collection", "series"],
      idPrefixes: ["tt", config.prefix],
    },

    {
      name: "stream",
      types: ["movie", "collection", "series"],
      idPrefixes: ["tt", config.prefix],
    },
  ],
  types: ["movie", "series", "collection"],

  behaviorHints: {
    newEpisodeNotifications: true,
  },
  catalogs: [],
};

module.exports = { config, manifest };
