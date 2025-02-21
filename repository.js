const { config } = require("./config");
const fetch = require("node-fetch");

const vote_average = 6;
const vote_count = 10;

const getProviders = () => {
  const url =
    "https://api.themoviedb.org/3/watch/providers/tv?language=fr-FR&watch_region=US";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${config.authorization}`,
    },
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      return "results" in json
        ? json["results"].map((el) => {
            return {
              logo_path: el?.logo_path,
              provider_name: el?.provider_name,
              provider_id: el?.provider_id,
            };
          })
        : [];
    })
    .catch((err) => {
      console.error("error:" + err);
      return [];
    });
};

const findShow = (id, lang = "fr-FR") => {
  if (!id) return false;
  const url = `https://api.themoviedb.org/3/tv/${id}?language=${lang}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${config.authorization}`,
    },
  };

  let retries = 0;
  return fetch(url, options)
    .then((res) => res.json())
    .then(async (json) => {
      return "id" in json ? json : false;
    })
    .catch((err) => {
      console.error("error:" + err);
      return false;
    });
};

const findMovie = (id) => {
  if (!id) return false;

  const url = `https://api.themoviedb.org/3/movie/${id}?language=fr-FR`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${config.authorization}`,
    },
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      return "id" in json ? json : false;
    })
    .catch((err) => {
      console.error("error:" + err);
      return false;
    });
};

const getSeason = (tvid, season) => {
  if (!tvid) return false;
  if (!season) {
    season = 0;
  }

  const url = `https://api.themoviedb.org/3/tv/${tvid}/season/${season}?language=fr-FR`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${config.authorization}`,
    },
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      return "id" in json ? json : false;
    })
    .catch((err) => {
      console.error("error:" + err);
      return false;
    });
};

const externalSourceMovie = (id) => {
  if (!id) return false;

  const url = `https://api.themoviedb.org/3/movie/${id}/external_ids`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${config.authorization}`,
    },
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      return "imdb_id" in json ? json : false;
    })
    .catch((err) => {
      console.error("error:" + err);
      return false;
    });
};

const externalSourceShow = (id) => {
  if (!id) return false;

  const url = `https://api.themoviedb.org/3/tv/${id}/external_ids`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${config.authorization}`,
    },
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      return "imdb_id" in json ? json : false;
    })
    .catch((err) => {
      console.error("error:" + err);
      return false;
    });
};

const getTVGenres = () => {
  const url = "https://api.themoviedb.org/3/genre/tv/list?language=fr";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${config.authorization}`,
    },
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      return "genres" in json ? json["genres"] : [];
    })
    .catch((err) => {
      console.error("error:" + err);
      return [];
    });
};

const getMovieGenres = () => {
  const url = "https://api.themoviedb.org/3/genre/movie/list?language=fr";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${config.authorization}`,
    },
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      return "genres" in json ? json["genres"] : [];
    })
    .catch((err) => {
      console.error("error:" + err);
      return [];
    });
};

const discoverTVShows = (
  providerID,
  region = "US",
  page,
  genre,
  origin,
  category
) => {
  let today = new Date().toISOString().split("T")[0];
  let start = `${new Date().getFullYear() - 2}-01-01`;

  let url =
    `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=fr-FR&vote_average.gte=${vote_average}&vote_count.gte=${vote_count}&first_air_date.lte=${today}` +
    (providerID
      ? `&with_watch_providers=${providerID}&watch_region=${region}`
      : "") +
    (page ? `&page=${page}` : "") +
    (genre ? `&with_genres=${genre}` : "") +
    (origin ? `&with_origin_country=${origin}` : "") +
    (category == "popularity" || !!genre
      ? `&sort_by=popularity.desc`
      : "&sort_by=first_air_date.desc") +
    (["newly_added", "popularity"].includes(category) ||
    (category == null && genre == null)
      ? `&without_genres=10764|10766|10767`
      : "");

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${config.authorization}`,
    },
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      return "results" in json ? json["results"] : [];
    })
    .catch((err) => {
      console.error("error:" + err);
      return [];
    });
};

const onAirTVShows = (
  providerID,
  region = "US",
  page,
  genre,
  origin,
  category
) => {
  let today = new Date().toISOString().split("T")[0];
  let tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  let twoMonthsAgo =
    new Date(new Date().getTime() - 2 * 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0]
      .slice(0, 8) + "01";

  let url =
    `https://api.themoviedb.org/3/discover/tv?air_date.gte=${twoMonthsAgo}&air_date.lte=${tomorrow}&first_air_date.gte=2010-01-01&include_adult=false&include_null_first_air_dates=false&sort_by=popularity.desc&vote_average.gte=6&vote_count.gte=15&language=fr-FR` +
    (providerID
      ? `&with_watch_providers=${providerID}&watch_region=${region}`
      : "") +
    (page ? `&page=${page}` : "") +
    (genre ? `&with_genres=${genre}` : "") +
    (origin ? `&with_origin_country=${origin}` : "") +
    (["newly_added", "popularity"].includes(category) ||
    category == null ||
    genre == null
      ? `&without_genres=10764|10766|10767`
      : "");

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${config.authorization}`,
    },
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      return "results" in json ? json["results"] : [];
    })
    .catch((err) => {
      console.error("error:" + err);
      return [];
    });
};

const discoverMovies = (
  providerID,
  region = "US",
  page = 1,
  genre,
  origin,
  category = "popularity"
) => {
  let start = `${new Date().getFullYear() - 2}-01-01`;
  let today = new Date().toISOString().split("T")[0];

  let url =
    `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=fr-FR&vote_average.gte=${vote_average}&vote_count.gte=${vote_count}&primary_release_date.lte=${today}` +
    (providerID
      ? `&with_watch_providers=${providerID}&watch_region=${region}`
      : "") +
    (page ? `&page=${page}` : "") +
    (genre ? `&with_genres=${genre}` : "") +
    (origin ? `&with_origin_country=${origin}` : "") +
    (category == "popularity" || !!genre
      ? `&sort_by=popularity.desc`
      : "&sort_by=primary_release_date.desc") +
    (["newly_added", "popularity"].includes(category) ||
    (category == null && genre == null)
      ? `&without_genres=10764|10766|10767`
      : "");

  console.log({ url });

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${config.authorization}`,
    },
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      return "results" in json ? json["results"] : [];
    })
    .catch((err) => {
      console.error("error:" + err);
      return [];
    });
};

const trendingTVShows = () => {
  let url = `https://api.themoviedb.org/3/trending/tv/day?language=fr-FR`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${config.authorization}`,
    },
  };
  return fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      return "results" in json ? json["results"] : [];
    })
    .catch((err) => {
      console.error("error:" + err);
      return [];
    });
};

const trendingMovies = () => {
  let url = `https://api.themoviedb.org/3/trending/movie/day?language=fr-FR`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${config.authorization}`,
    },
  };
  return fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      return "results" in json ? json["results"] : [];
    })
    .catch((err) => {
      console.error("error:" + err);
      return [];
    });
};

const sortedMovies = (category = "popularity", page, genre = "", year = "") => {
  const start = `${year}-01-01`;
  const end = `${year}-12-31`;
  const today = new Date().toISOString().split("T")[0];

  let url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=fr-FR&sort_by=popularity.desc&vote_count.gte=${vote_count}&vote_average.gte=${vote_average}`;

  switch (category) {
    case "top_rated":
      url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=fr-FR&sort_by=vote_average.desc&without_genres=10755&vote_count.gte=${vote_count}&vote_average.gte=${vote_average}`;
      break;
    case "popularity":
      url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=fr-FR&sort_by=vote_average.desc&without_genres=10755&vote_count.gte=200&vote_average.gte=${vote_average}`;
      break;
    case "newly_added":
    case "new":
      url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=primary_release_date.desc&vote_average.gte=${vote_average}&vote_count.gte=${vote_count}`;
      break;
    default:
      break;
  }

  url =
    url +
    (page ? `&page=${page}` : "") +
    (!!genre ? `&with_genres=${genre}` : "") +
    (!!year
      ? `&primary_release_date.lte=${end}&primary_release_date.gte=${start}`
      : `&primary_release_date.lte=${today}`) +
    (["newly_added", "popularity"].includes(category) || category == null
      ? `&without_genres=10764|10766|10767`
      : "");

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${config.authorization}`,
    },
  };
  return fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      let r =
        "results" in json
          ? json
          : {
              results: [],
              total_pages: 1,
              total_results: 0,
            };
      // let r = "results" in json ? json["results"] : [];
      return r;
    })
    .catch((err) => {
      console.error("error:" + err);
      return {
        results: [],
        total_pages: 1,
        total_results: 0,
      };
    });
};

const sortedTV = (category = "popularity", page, genre = "", year = "") => {
  const start = `${year}-01-01`;
  const end = `${year}-12-31`;
  const today = new Date().toISOString().split("T")[0];

  let url = `https://api.themoviedb.org/3/discover/tv?include_adult=false&language=fr-FR&sort_by=popularity.desc&vote_average.gte=${vote_average}&vote_count.gte=${vote_count}&first_air_date.lte=${today}`;

  switch (category) {
    case "top_rated":
    case "popularity":
      url = `https://api.themoviedb.org/3/discover/tv?include_adult=false&language=fr-FR&sort_by=vote_average.desc&vote_count.gte=200&vote_average.gte=${vote_average}`;
      break;
    case "newly_added":
    case "new":
      url = `https://api.themoviedb.org/3/discover/tv?include_adult=false&language=fr-FR&sort_by=first_air_date.desc&vote_average.gte=${vote_average}&first_air_date.lte=${today}&vote_count.gte=${vote_count}`;
      break;
    default:
      break;
  }

  url =
    url +
    (page ? `&page=${page}` : "") +
    (!!genre ? `&with_genres=${genre}` : "") +
    (!!year ? `&first_air_date.lte=${end}&first_air_date.gte=${start}` : "") +
    (["newly_added", "popularity"].includes(category) || category == null
      ? `&without_genres=10764|10766|10767`
      : "");

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${config.authorization}`,
    },
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      return "results" in json ? json["results"] : [];
    })
    .catch((err) => {
      console.error("error:" + err);
      return [];
    });
};

const searchTVShows = (page = 1, query = "") => {
  let url = `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=${page}`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${config.authorization}`,
    },
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      return "results" in json ? json["results"] : [];
    })
    .catch((err) => {
      console.error("error:" + err);
      return [];
    });
};

const searchMovies = (page = 1, query = "") => {
  let url = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${config.authorization}`,
    },
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      return "results" in json ? json["results"] : [];
    })
    .catch((err) => {
      console.error("error:" + err);
      return [];
    });
};

const searchCollection = async (page = 1, query = "") => {
  let url = `https://api.themoviedb.org/3/search/collection?query=${encodeURIComponent(
    query
  )}&include_adult=false&language=fr-FR&page=${page}`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${config.authorization}`,
    },
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      return "results" in json ? json : {};
    })
    .catch((err) => {
      console.error("error:" + err);
      return [];
    });
};

const getCastTeam = (id = 1, type = "tv") => {
  if (!id) return [];
  if (!type) return [];
  if (!["tv", "movie"].includes(type)) return [];

  let url = `https://api.themoviedb.org/3/${type}/${id}/credits?language=fr-FR`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${config.authorization}`,
    },
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      return "cast" in json
        ? json["cast"]
            .filter((cast) => cast["known_for_department"] == "Acting")
            .map((cast) => cast["original_name"])
            .sort(
              (c1, c2) =>
                parseInt(c1["order"] ?? 0) - parseInt(c2["order"] ?? 0)
            )
        : [];
    })
    .catch((err) => {
      console.error("error:" + err);
      return [];
    });
};

const getCollectionsFromMovies = async (movies = []) => {
  // First get movies from discover

  // Then fetch full details for each movie to get collection info
  const moviesWithDetails = await Promise.all(
    movies.map(async (movie) => {
      const details = await findMovie(movie.id);
      return {
        ...movie,
        collection: details?.belongs_to_collection || null,
      };
    })
  );

  let moviesInCollections = moviesWithDetails.map((movie) => movie.collection);
  moviesInCollections = moviesInCollections.filter(
    (collection) => collection !== null
  );

  return {
    results: moviesInCollections,
    total_results: moviesInCollections.length,
  };
};

let findCollection = async (id = "") => {
  let url = `https://api.themoviedb.org/3/collection/${id}?language=fr-FR`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${config.authorization}`,
    },
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      return "id" in json ? json : false;
    })
    .catch((err) => {
      console.error("error:" + err);
      return false;
    });
};

// (async () => {
//   require("fs").writeFileSync(
//     "./assets/collections.bak.json",
//     JSON.stringify(await getDiscoverMoviesWithCollections(), null, 2)
//   );
// })();

// REMOTE IMAGE
// https://image.tmdb.org/t/p/original/xxxxxxxxxxxxxxxxxxx.svg
// https://image.tmdb.org/t/p/original/xxxxxxxxxxxxxxxxxxx.png
// https://image.tmdb.org/t/p/w500/xxxxxxxxxxxxxxxxxxx.png

module.exports = {
  discoverTVShows,
  discoverMovies,
  getTVGenres,
  getMovieGenres,
  getProviders,
  findMovie,
  findShow,
  externalSourceMovie,
  externalSourceShow,
  getSeason,
  trendingMovies,
  trendingTVShows,
  sortedMovies,
  sortedTV,
  searchTVShows,
  searchMovies,
  searchCollection,
  getCastTeam,
  onAirTVShows,
  getCollectionsFromMovies,
  findCollection,
};
