const got = require("got");

const json = got.extend({
  responseType: "json",
  resolveBodyOnly: true,
});

async function proxy(path, authHeader) {
  const response = await json.get(`https://api.robinhood.com/${path}`, {
    headers: {
      authorization: authHeader,
    },
  });
  return response;
}

module.exports = proxy;
