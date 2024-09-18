let tv_grenres = require("./tv_genres.json");
let movie_grenres = require("./movie_genre.json");

module.exports = {
  tv_grenres,
  movie_grenres,
  genres: Array.from(new Set([...tv_grenres, ...movie_grenres])),
};
