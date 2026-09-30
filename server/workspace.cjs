const d = require("./domain.cjs");
const { text, HttpError } = require("./http.cjs");
module.exports = {
  title: "Movie explorer",
  resources: {
    favorites: {
      label: "Movie favorites",
      uniqueField: "movieId",
      fields: [
        d.field("movieId", "Movie ID", "number", { min: 1 }),
        d.field("title", "Movie title"),
      ],
    },
  },
};
