/**
 * Parses the request object and extracts relevant parameters.
 *
 * @param {import("express").Request} req - The request object.
 * @param {string} req.params.type - The type of the request.
 * @param {string} req.params.id - The ID of the request.
 * @param {string} req.params.extra - Additional parameters in the request.
 * @returns {Object} - An object containing the parsed parameters.

 */
const parseRequest = (req) => {
  const { type, id, extra } = req.params;
  const parsed = new URLSearchParams(extra);
  const genre = parsed.get("genre");
  const skip = parsed.get("skip");
  const search = parsed.get("search");
  return { type, id, skip, genre, search };
};

module.exports = { parseRequest };
