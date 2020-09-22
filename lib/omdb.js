const got = require("got");
const mem = require("mem");

const json = got.extend({
  responseType: "json",
  resolveBodyOnly: true,
});

async function getOMDB(type, title) {
  const response = await json.get(
    `https://omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&type=${type}&t=${title}`
  );
  return response;
}

module.exports = mem(getOMDB, {
  cacheKey: (arguments_) => arguments_.join(","),
  maxAge: 86400000, // 24 hours in milliseconds
});
