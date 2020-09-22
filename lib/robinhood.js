const got = require("got");

const json = got.extend({
  responseType: "json",
  resolveBodyOnly: true,
});

async function proxy(path, authHeader) {
  try {
    const response = await json.get(`https://api.robinhood.com/${path}`, {
      headers: {
        authorization: authHeader,
      },
    });
    return response;
  } catch (e) {
    console.log(path);
    console.error(e);
    throw e;
  }
}

module.exports = proxy;
