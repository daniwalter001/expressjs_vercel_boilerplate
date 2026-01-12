const categories = {
  popularity: "Popularity",
  newly_added: "Nouveau",
  onair: "On Air",
  top: "Trending",
  top_rated: "Top Rated",
};

const years = () => {
  let years = [];
  const start = 1980;
  const end = new Date().getFullYear();
  for (let i = end; i >= start; i--) {
    years.push(i);
  }
  return years;
};

const origins = {
  HK: "Hong Kong",
  ZH: "China",
  KR: "Korea",
  JP: "Japon",
  US: "USA",
  FR: "France",
  UK: "United Kingdom",
};

let toKey = (clean = "") => {
  return clean.toLowerCase().replace(/\s/g, "+");
};

let toClean = (clean = "") => {
  return clean.replace(/\+/g, " ");
};

module.exports = { toClean, toKey, years, origins, categories };
