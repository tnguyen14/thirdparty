const got = require("got");
const mem = require("mem");

const json = got.extend({
  responseType: "json",
  resolveBodyOnly: true,
});

async function getOMDB(type, title, year) {
  const searchParams = { apikey: process.env.OMDB_API_KEY, t: title };
  if (type) {
    searchParams.type = type;
  }
  // year disambiguates titles shared by multiple shows/movies
  if (year) {
    searchParams.y = year;
  }
  return json.get("https://omdbapi.com/", { searchParams });
}

module.exports = mem(getOMDB, {
  cacheKey: (arguments_) => arguments_.join(","),
  maxAge: 86400000, // 24 hours in milliseconds
});
