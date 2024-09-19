const categories = { popularity: "Popularity", newly_added: "Nouveau" };

const years = [
  "2024",
  "2023",
  "2022",
  "2021",
  "2020",
  "2019",
  "2018",
  "2017",
  "2016",
  "2015",
  "2014",
  "2013",
  "2012",
  "2011",
  "2010",
  "2009",
  "2008",
  "2007",
  "2006",
  "2005",
  "2004",
  "2003",
  "2002",
  "2001",
  "2000",
  "1999",
  "1998",
  "1997",
  "1996",
  "1995",
  "1994",
  "1993",
  "1992",
  "1991",
  "1990",
  "1989",
  "1988",
  "1987",
  "1986",
  "1985",
  "1984",
  "1983",
  "1982",
  "1981",
  "1980",
];

const origins = {
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
