const { genres } = require("./assets/genres");
const { manifest, config } = require("./config");
const { parseRequest } = require("./helpers");
const {
  externalSourceMovie,
  getCollectionsFromMovies,
  findCollection,
  searchCollection,
  sortedPpl,
  getPplDetail,
  getPplMovies,
  findMovie,
} = require("./repository");
const { categories } = require("./utils");
// const JsonDatabase = require("./db/index");

// const db = new JsonDatabase();

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

    //Default
    manifest.catalogs.push({
      name: "Perso Trending",
      type: "movie",
      id: `${config.prefix}&id=top`,
      // genres: [...genres.map((el) => el.name)],
      extra: [
        // {
        //   name: "genre",
        //   options: [...genres.map((el) => el.name)],
        // },
        { name: "skip" },
        { name: "search" },
      ],
      extraSupported: ["genre", "skip", "search"],
    });

    //popular
    manifest.catalogs.push({
      name: "Perso Popular",
      type: "movie",
      id: `${config.prefix}&id=popularity`,
      // genres: [...genres.map((el) => el.name)],
      extra: [
        // {
        //   name: "genre",
        //   options: [...genres.map((el) => el.name)],
        // },
        { name: "skip" },
      ],
      extraSupported: ["genre", "skip"],
    });

    var json = { ...manifest };
    return res.send(json);
  }

  static async handleCollection(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", "application/json");

    const { type, id, skip, genre: extra, search } = parseRequest(req);
    console.log({ type, id, skip, extra });

    let genre = null;
    let category = null;
    let catalog = [];
    let _skip = 1;
    let genresValues = genres.map((el) => el.name);

    let categoryId = id.split("&id=").pop();
    category = Object.keys(categories).includes(categoryId)
      ? categories[categoryId]
      : "Trending";

    if (extra) {
      if (genresValues.includes(extra)) {
        genre = genres.find((el) => el.name == extra);
      }
    }

    try {
      _skip = Math.floor(skip / 14) + 1;

      console.log({ page: _skip });

      if (search) {
        console.log(`Searching and looking for...${search}`);
        catalog = await searchCollection(_skip, search);
      } else {
        console.log({ categoryId, category, genre });

        //newly_added, popularity for category

        let r = await sortedPpl(
          "top",
          // categoryId || "top",
          _skip,
          extra && genre ? genre.id : null
        );

        catalog = r && "results" in r ? r.results : [];
      }
    } catch (error) {
      console.log(error);
      return Promise.resolve({ metas: [] });
    }

    let collection = search ? [] : catalog;
    // let collection = search ? catalog : await getCollectionsFromMovies(catalog);

    console.log({ Collection: collection.length });

    let t = [
      ...collection?.map((one) => {
        return {
          name: one?.name,
          id: config.prefix + one?.id,
          type: "movie",
          poster: config.cdn_path + one?.profile_path,
          background:
            "https://dnm.nflximg.net/api/v6/2DuQlx0fM4wd1nzqm5BFBi6ILa8/AAAAQRC29H19twWKcTZ9Zpg4biJbGNaHF2GGIYNcLt4eZ6fvwugUJbuKxTjjMFPCS-y5P3ZePL57rupDtSkyUIJhv3P8leMJGMzszuG2CHNd65NwWPu5LeKxQkRNfNMHmxAwt7tmQZFk1VIrBd1aXr2AR5DM.jpg?r=5b1",
          // background: config.cdn_path + one?.profile_path,
        };
      }),
    ];

    return res.send({
      metas: t,
    });
  }

  /**
   *  Handle Metadata
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns
   */
  static async handleMeta(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", "application/json");

    let { id } = parseRequest(req);

    id = (id ?? "").replace(config.prefix, "");
    let show = {};
    let ppl = {};
    try {
      show = await getPplMovies(id);
      ppl = await getPplDetail(id);
    } catch (error) {
      return Promise.resolve({ metas: [] });
    }

    return await new Promise(async (resolve, reject) => {
      let imdbRating = show
        ? show
            ?.filter((el) => !!el && el?.id && !!el?.release_date)
            ?.reduce((cumul, currentValue) => {
              cumul = cumul + (currentValue?.vote_average || 0);
              return cumul;
            }, 0) / show?.length
        : 5;

      imdbRating = imdbRating.toFixed(1);

      let released =
        "birthday" in ppl
          ? ppl?.birthday?.slice(0, 4) +
            ("deathday" in ppl && ppl?.deathday
              ? "-" + ppl?.deathday?.slice(0, 4)
              : "")
          : show && show?.length > 0
          ? `${
              show
                .find((el) => !!el?.id && !!el?.release_date)
                ?.release_date?.slice(0, 4) || new Date().getFullYear()
            }-${
              show
                .filter((el) => !!el?.id && !!el?.release_date)
                .pop()
                ?.release_date?.slice(0, 4) || new Date().getFullYear()
            }`
          : `${new Date().getFullYear()}-${new Date().getFullYear()}`;

      // console.log({ released });
      // console.log({ imdbRating });

      let meta = {
        name: ppl?.name,
        description: ppl?.biography,
        id: config.prefix + id?.toString(),
        type: "movie",
        imdbRating,
        releaseInfo: released,
        poster: config.cdn_path + ppl?.profile_path,
        background:
          "https://dnm.nflximg.net/api/v6/2DuQlx0fM4wd1nzqm5BFBi6ILa8/AAAAQRC29H19twWKcTZ9Zpg4biJbGNaHF2GGIYNcLt4eZ6fvwugUJbuKxTjjMFPCS-y5P3ZePL57rupDtSkyUIJhv3P8leMJGMzszuG2CHNd65NwWPu5LeKxQkRNfNMHmxAwt7tmQZFk1VIrBd1aXr2AR5DM.jpg?r=5b1",
        // genres: show?.genres?.map((el) => el?.name),
      };

      if (show) {
        meta.videos = await Promise.all(
          show
            ?.filter((el) => {
              return !!el && el?.id && !!el?.release_date;
            })
            .map(async (movie) => {
              const imdbIdJson = await externalSourceMovie(movie?.id);
              const movieData = await findMovie(movie?.id);

              movie = movieData ? movieData : movie;

              let title = `${movie?.title}`;
              let id = imdbIdJson ? `${imdbIdJson["imdb_id"]}` : "";
              let release_date =
                `${movie?.release_date ?? new Date().toISOString()}`.substring(
                  0,
                  10
                ) + "T05:00:00.000Z";

              return {
                id,
                title,
                overview: movie?.overview,
                type: "movie",
                released: release_date,
                thumbnail:
                  config.cdn_path +
                  ("backdrop_path" in movie && movie?.backdrop_path
                    ? movie?.backdrop_path
                    : movie?.poster_path),
              };
            })
        );

        meta.videos = (meta.videos ?? []).flat();
      }

      return res.send({ meta });
    });
  }

  static async handleStream(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", "application/json");
    const { type, id, genre: extra } = parseRequest(req);
    console.log({ type, id, extra });
  }
}

module.exports = CatalogAddon;
