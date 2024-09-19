const providers = require("./assets/providers");
const { genres } = require("./assets/genres");
const { manifest, config } = require("./config");
const { parseRequest } = require("./helpers");
const {
  searchMovies,
  searchTVShows,
  sortedMovies,
  sortedTV,
  trendingTVShows,
  trendingMovies,
  externalSourceMovie,
  discoverTVShows,
  discoverMovies,
  findShow,
  externalSourceShow,
  findMovie,
  getCastTeam,
  getSeason,
} = require("./repository");
const { toClean, years, origins, categories } = require("./utils");

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

    //new
    manifest.catalogs.push({
      type: "movie",
      id: `${config.prefix}&id=top`,
      genres: [
        ...Object.values(categories),
        ...genres.map((el) => el.name),
        ...Object.values(origins),
      ],
      extra: [
        {
          name: "genre",
          options: [
            ...Object.values(categories),
            ...genres.map((el) => el.name),
            ...Object.values(origins),
          ],
        },
        { name: "search" },
        { name: "skip" },
      ],
      extraSupported: ["search", "genre", "skip"],
      name: "All",
    });

    manifest.catalogs.push({
      type: "series",
      id: `${config.prefix}&id=top`,
      genres: [
        ...Object.values(categories),
        ...genres.map((el) => el.name),
        ...Object.values(origins),
      ],
      extra: [
        {
          name: "genre",
          options: [
            ...Object.values(categories),
            ...genres.map((el) => el.name),
            ...Object.values(origins),
          ],
        },
        { name: "search" },
        { name: "skip" },
      ],
      extraSupported: ["search", "genre", "skip"],
      name: "All",
    });

    //new
    manifest.catalogs.push({
      type: "movie",
      id: `${config.prefix}&id=new`,
      genres: [...years],
      extra: [
        {
          name: "genre",
          options: [...years],
        },
        { name: "search" },
        { name: "skip" },
      ],
      extraSupported: ["search", "genre", "skip"],
      name: "New",
    });

    manifest.catalogs.push({
      type: "series",
      id: `${config.prefix}&id=new`,
      genres: [...years],
      extra: [
        {
          name: "genre",
          options: [...years],
        },
        { name: "search" },
        { name: "skip" },
      ],
      extraSupported: ["search", "genre", "skip"],
      name: "New",
    });

    //providers

    providers.forEach((provider) => {
      manifest.catalogs.push({
        type: "movie",
        id: `${config.prefix}&id=${provider.provider_id}`,
        genres: [
          ...Object.values(categories),
          ...genres.map((el) => el.name),
          ...Object.values(origins),
        ],
        extra: [
          {
            name: "genre",
            options: [
              ...Object.values(categories),
              ...genres.map((el) => el.name),
              ...Object.values(origins),
            ],
          },
          { name: "search" },
          { name: "skip" },
        ],
        extraSupported: ["search", "genre", "skip"],
        name: provider.provider_name,
      });

      manifest.catalogs.push({
        type: "series",
        id: `${config.prefix}&id=${provider.provider_id}`,
        genres: [
          ...Object.values(categories),
          ...genres.map((el) => el.name),
          ...Object.values(origins),
        ],
        extra: [
          {
            name: "genre",
            options: [
              ...Object.values(categories),
              ...genres.map((el) => el.name),
              ...Object.values(origins),
            ],
          },
          { name: "search" },
          { name: "skip" },
        ],
        extraSupported: ["search", "genre", "skip"],
        name: provider.provider_name,
      });
    });

    var json = { ...manifest };
    return res.send(json);
  }

  /**
   *  Handle Catalog
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns
   */
  static async handleCatalog(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", "application/json");

    const { type, id, skip, genre: extra } = parseRequest(req);
    console.log({ type, id, skip, extra });

    let search = null;
    let genre = null;
    let year = null;
    let category = null;
    let origin = null;
    let catalog = [];
    let genresValues = genres.map((el) => el.name);

    let providerId = id.split("&id=").pop();
    // console.log({ providerId });
    let provider = providers.find((el) => el.provider_id == providerId);

    if (extra) {
      if (Object.values(categories).includes(extra)) {
        const index = Object.values(categories).findIndex((el) => el == extra);
        category = index != -1 ? Object.keys(categories).at(index) : "trending";
      } else if (Object.values(origins).includes(extra)) {
        const index = Object.values(origins).findIndex((el) => el == extra);
        origin = index != -1 ? Object.keys(origins).at(index) : null;
      } else if (genresValues.includes(extra)) {
        genre = genres.find((el) => el.name == extra);
      } else if (years.includes(extra)) {
        year = extra;
      }
    }

    try {
      let _skip = Math.floor((skip ?? 0) / 20) + 1;
      console.log({ page: _skip });

      if (search) {
        console.log(`Searching and looking for...${extra.search}`);
        switch (type) {
          case "series":
            catalog = await searchTVShows(skip, extra.search);
            break;
          case "movie":
            catalog = await searchMovies(skip, extra.search);
            break;

          default:
            break;
        }
      } else {
        if (!provider && !category & !origin) {
          console.log({ genre });

          if (providerId == "new") {
            category = "new";
          } else if (providerId == "top") {
            if (!!genre) {
              category = "trending+genre";
            } else {
              category = "trending";
            }
          } else {
            category = "trending";
          }
        }

        console.log({ category, genre, origin, provider });

        if (category && !provider) {
          switch (category) {
            case "trending":
              catalog =
                type == "movie"
                  ? await trendingMovies()
                  : await trendingTVShows();
              break;

            case "trending+genre":
            case "new":
            default:
              catalog =
                type == "movie"
                  ? await sortedMovies(
                      category,
                      _skip,
                      extra && genre ? genre.id : null,
                      year
                    )
                  : await sortedTV(
                      category,
                      _skip,
                      extra && genre ? genre.id : null,
                      year
                    );
              break;
          }
        } else {
          if (type == "movie") {
            catalog = await discoverMovies(
              provider?.provider_id,
              provider?.region ?? "US",
              _skip,
              extra && genre ? genre?.id : null,
              extra ? origin : null,
              category
            );
          } else {
            try {
              catalog = await discoverTVShows(
                provider?.provider_id,
                provider?.region ?? "US",
                _skip,
                extra && genre ? genre?.id : null,
                extra ? origin : null,
                category
              );
            } catch (error) {
              console.log({ error });
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
      return Promise.resolve({ metas: [] });
    }

    for (let index in catalog) {
      let one = catalog[index];
      if (type == "movie") {
        let _imdbRequest = await externalSourceMovie(one?.id);
        one["imdb_id"] =
          "imdb_id" in _imdbRequest ? _imdbRequest["imdb_id"] : null;
        catalog[index] = one;
      }
    }

    return res.send({
      metas: [
        ...catalog.map((one) => {
          return {
            name: type == "series" ? one?.name : one?.title,
            id:
              type == "series"
                ? config.prefix + one?.id
                : "imdb_id" in one && !!one?.imdb_id
                ? one?.imdb_id
                : config.prefix + one?.id,
            description: one?.overview,
            type: type,
            imdbRating: one?.vote_average,
            releaseInfo:
              type == "series"
                ? `${one?.first_air_date}`.substring(0, 4)
                : `${one?.release_date}`.substring(0, 4),
            poster: config.cdn_path + one?.poster_path,
            background: config.cdn_path + one?.backdrop_path,
          };
        }),
      ],
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

    let { type, id, skip, genre } = parseRequest(req);

    if (type == "movie" && id.includes("tt")) {
      try {
        let req = await fetch(
          `https://cinemeta-live.strem.io/meta/movie/${id}.json`
        );
        if (req.ok) {
          let json = await req.json();
          return res.json(json);
        }
      } catch (error) {
        console.log({ error });
        return res.json({
          meta: {
            id: id,
            type: type,
          },
        });
      }
    }

    id = (id ?? "").replace(config.prefix, "");
    let show = {};
    let imdb = {};
    let cast = [];
    try {
      if (type == "series") {
        show = await findShow(id);
        show =
          "overview" in show && show["overview"] != ""
            ? show
            : await findShow(id, "en-US");

        imdb = await externalSourceShow(id);
      } else if ((type = "movie")) {
        show = await findMovie(id);
        imdb = await externalSourceMovie(id);
      }
      cast = await getCastTeam(id, type == "series" ? "tv" : "movie");
    } catch (error) {
      return Promise.resolve({ metas: [] });
    }

    cast = cast.length < 4 ? cast : cast.slice(0, 4);

    return await new Promise(async (resolve, reject) => {
      let meta = {
        name: type == "series" ? show?.name : show?.title,
        description: show?.overview,
        id:
          type == "series"
            ? id
            : show?.imdb_id ??
              (imdb && "imdb_id" in imdb ? imdb["imdb_id"] : ""),
        type: type,
        imdbRating: show?.vote_average,
        released:
          type == "movie"
            ? show?.release_date
              ? `${show?.release_date}T05:00:00.000Z`
              : new Date().toISOString()
            : show?.first_air_date
            ? `${show?.first_air_date}T05:00:00.000Z`
            : new Date().toISOString(),
        genres: show?.genres?.map((el) => el?.name),
        poster: config.cdn_path + show?.poster_path,
        background: config.cdn_path + show?.backdrop_path,
        cast,
      };

      if (type == "series" && show?.seasons) {
        meta.videos = await Promise.all(
          show?.seasons.map(async (saison) => {
            let arr = [];
            const seasonDetail = await getSeason(id, saison?.season_number);
            if (!seasonDetail) return arr;
            if (!("episodes" in seasonDetail)) return arr;
            return await new Promise((resolve, reject) => {
              for (let el of seasonDetail["episodes"]) {
                let title = `${el?.name}`;
                let id = imdb
                  ? `${imdb["imdb_id"]}:${parseInt(saison?.season_number)}:${
                      parseInt(el?.episode_number) ?? 0
                    }`
                  : "";

                arr.push({
                  id,
                  title,
                  overview: el?.overview,
                  season: saison?.season_number,
                  episode: parseInt(el?.episode_number) ?? 0,
                  released:
                    `${el?.air_date ?? new Date().toISOString()}`.substring(
                      0,
                      10
                    ) + "T05:00:00.000Z",
                  thumbnail: config.cdn_path + el?.still_path,
                });
              }
              resolve(arr);
            });
          })
        );

        meta.videos = (meta.videos ?? []).reduce(
          (currentArray, currentValue) => {
            currentArray = currentArray.concat(currentValue);
            return currentArray;
          },
          []
        );
      }

      return res.send({ meta });
    });
  }

  /**
   *  Handle Streams
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns
   */
  // static handleStram(req, res) {
  //   res.setHeader("Access-Control-Allow-Origin", "*");
  //   res.setHeader("Access-Control-Allow-Headers", "*");
  //   res.setHeader("Content-Type", "application/json");

  //   const { type, id, skip, genre } = parseRequest(req);
  //   console.log({ type, id, skip, genre });

  //   return res.send({ meta: [] });
  // }
}

module.exports = CatalogAddon;
