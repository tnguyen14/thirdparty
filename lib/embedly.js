const got = require("got");
const mem = require("mem");

const json = got.extend({
  responseType: "json",
  resolveBodyOnly: true,
});

async function extractEmbedly(url) {
  const response = await json.get(
    `https://api.embed.ly/1/extract?key=${
      process.env.EMBEDLY_API_KEY
    }&url=${encodeURIComponent(url)}&format=json`
  );
  if (response.type == "error") {
    throw new Error(`${response.error_code} - ${response.error_message}`);
  }
  return response;
}

module.exports = mem(extractEmbedly, {
  maxAge: 300000, // cache for 5 minutes
});
