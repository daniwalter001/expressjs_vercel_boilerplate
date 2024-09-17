const config = {
  id: "strm.daiki.tmdb_ctlg",
  version: "1.0.0",
  name: "Catalog Vercel",
  description: "From uhdmovie.dad",
  logo: "https://raw.githubusercontent.com/daniwalter001/daniwalter001/main/52852137.png",
};

const manifest = {
  id: config.id,
  version: config.version,
  name: config.name,
  description: config.description,
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

module.exports = { config, manifest };
