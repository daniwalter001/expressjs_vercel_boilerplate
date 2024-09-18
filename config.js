const config = {
  id: "strm.daiki.tmdb_ctlg",
  prefix: "tmdb_ctlg.addon",
  version: "1.0.0",
  name: "Catalog Vercel",
  description: "From Catalog Vercel",
  logo: "https://raw.githubusercontent.com/daniwalter001/daniwalter001/main/52852137.png",
};

const manifest = {
  id: config.id,
  version: config.version,
  name: config.name,
  description: config.description,
  logo: config.logo,
  resources: ["catalog", "meta", "addon_catalog"],
  types: ["movie", "series"],
  behaviorHints: {
    newEpisodeNotifications: true,
  },
  catalogs: [],
};

module.exports = { config, manifest };
