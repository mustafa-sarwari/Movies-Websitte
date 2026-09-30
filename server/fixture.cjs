module.exports = {
  ...{ resource: "favorites", invalid: {}, patch: { title: "Updated movie" } },
  body: async (url, cookie) => {
    return { movieId: 1, title: "Sample movie" };
  },
};
