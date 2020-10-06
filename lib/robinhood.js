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
    // @TODO how to set the "message" property of response to this
    // https://www.fastify.io/docs/v1.13.x/Reply/#errors
    console.error(`${path}: ${e.message}`);
    throw e;
  }
}

module.exports = proxy;
