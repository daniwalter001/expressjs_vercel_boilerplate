const { genres } = require("./assets/genres");
const { manifest, config } = require("./config");
const { parseRequest } = require("./helpers");
const {
  searchMovies,
  sortedMovies,
  trendingMovies,
  externalSourceMovie,
  getCollectionsFromMovies,
  findCollection,
  searchCollection,
} = require("./repository");
const { categories } = require("./utils");

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
      name: "Collection Trending",
      type: "movie",
      id: `${config.prefix}&id=top`,
      genres: [...genres.map((el) => el.name)],
      extra: [
        {
          name: "genre",
          options: [...genres.map((el) => el.name)],
        },
        { name: "skip" },
        { name: "search" },
      ],
      extraSupported: ["genre", "skip", "search"],
    });

    //popular
    manifest.catalogs.push({
      name: "Collection Popular",
      type: "movie",
      id: `${config.prefix}&id=popularity`,
      genres: [...genres.map((el) => el.name)],
      extra: [
        {
          name: "genre",
          options: [...genres.map((el) => el.name)],
        },
        { name: "skip" },
      ],
      extraSupported: ["genre", "skip"],
    });

    //top_rated
    manifest.catalogs.push({
      name: "Collection Top Rated",
      type: "movie",
      id: `${config.prefix}&id=top_rated`,
      genres: [...genres.map((el) => el.name)],
      extra: [
        {
          name: "genre",
          options: [...genres.map((el) => el.name)],
        },
        { name: "skip" },
      ],
      extraSupported: ["genre", "skip"],
    });

    manifest.catalogs.push({
      name: "Collection Newly Added",
      type: "movie",
      id: `${config.prefix}&id=newly_added`,
      genres: [...genres.map((el) => el.name)],
      extra: [
        {
          name: "genre",
          options: [...genres.map((el) => el.name)],
        },
        { name: "skip" },
      ],
      extraSupported: ["genre", "skip"],
    });


    var json = { ...manifest };
    return res.send(json);
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

    let { type, id, skip, genre } = parseRequest(req);

    id = (id ?? "").replace(config.prefix, "");
    let show = {};
    let imdb = {};
    try {
      show = await findCollection(id);
    } catch (error) {
      return Promise.resolve({ metas: [] });
    }

    return await new Promise(async (resolve, reject) => {
      let meta = {
        name: show?.name,
        description: show?.overview,
        id: config.prefix + id?.toString(),
        type: "movie",
        imdbRating:
          show && "parts" in show
            ? show?.parts
                ?.filter((el) => !!el && el?.id && !!el?.release_date)
                ?.reduce((cumul, currentValue) => {
                  cumul = cumul + (currentValue?.vote_average || 0);
                  return cumul;
                }, 0) / show?.parts?.length
            : 5,
        released:
          show && "parts" in show && show?.parts?.length > 0
            ? `${
                show?.parts.find((el) => !!el?.id && !!el?.release_date)
                  ?.release_date
              }T05:00:00.000Z`
            : new Date().toISOString(),
        // genres: show?.genres?.map((el) => el?.name),
        poster: config.cdn_path + show?.poster_path,
        background: config.cdn_path + show?.backdrop_path,
      };

      if (show?.parts) {
        meta.videos = await Promise.all(
          show?.parts
            ?.filter((el) => {
              console.log(el.id);
              return !!el && el?.id && !!el?.release_date;
            })
            .map(async (movie, index) => {
              const imdbIdJson = await externalSourceMovie(movie?.id);

              let title = `${movie?.title}`;
              let id = imdbIdJson ? `${imdbIdJson["imdb_id"]}` : "";

              let t = {
                id,
                title,
                overview: movie?.overview,
                type: "movie",
                released:
                  `${
                    movie?.release_date ?? new Date().toISOString()
                  }`.substring(0, 10) + "T05:00:00.000Z",
                thumbnail: config.cdn_path + movie?.backdrop_path,
              };

              return t;
            })
        );

        meta.videos = (meta.videos ?? []).flat();
      }

      return res.send({ meta });
    });
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
      _skip = Math.floor((skip ?? 0) / 13) + 1;
      console.log({ page: _skip });

      if (search) {
        console.log(`Searching and looking for...${search}`);
        catalog = await searchCollection(_skip, search);
      } else {
        console.log({ categoryId, category, genre });

        //newly_added, popularity for category

        let r = await sortedMovies(
          categoryId || "top",
          _skip,
          extra && genre ? genre.id : null
        );

        console.log({
          total_pages: r?.total_pages,
          total_results: r?.total_results,
        });

        catalog = r && "results" in r ? r.results : [];
      }
    } catch (error) {
      console.log(error);
      return Promise.resolve({ metas: [] });
    }

    let collection = search ? catalog : await getCollectionsFromMovies(catalog);

    let t = [
      ...collection?.results.map((one) => {
        return {
          name: one?.name,
          id: config.prefix + one?.id,
          type: "movie",
          // imdbRating: 5,
          poster: config.cdn_path + one?.poster_path,
          background: config.cdn_path + one?.backdrop_path,
        };
      }),
    ];

    return res.send({
      metas: t,
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
