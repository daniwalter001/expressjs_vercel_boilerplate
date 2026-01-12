const categories = {
  popularity: "Popularity",
  newly_added: "Nouveau",
  onair: "On Air",
};

const toYears = () => {
  let years = [];
  const start = 1980;
  const end = new Date().getFullYear();
  for (let i = end; i >= start; i--) {
    years.push(i.toString());
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

module.exports = { toClean, toKey, years: toYears(), origins, categories };
