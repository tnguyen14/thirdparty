require("dotenv").config();
const got = require("got");
const mem = require("mem");

const fastify = require("fastify")({
  ignoreTrailingSlash: true,
});

const json = got.extend({
  responseType: "json",
  resolveBodyOnly: true,
});

fastify.register(require("fastify-sensible"));

fastify.register(require("fastify-cors"), {
  origin: ["https://lab.tridnguyen.com", "https://tridnguyen.com"],
});

fastify.setErrorHandler((err, req, reply) => {
  console.log("Default error handler", err);
  reply.send(err);
});

async function handleRequest(request, reply, fn) {
  try {
    const response = await fn(request.query, request.params, request.body);
    reply.send(response);
  } catch (e) {
    console.error(e);
    reply.send(e);
  }
}

fastify.get("/", async (request, reply) => {
  reply.send("OK");
});

async function getOMDB(type, title) {
  const response = await json.get(
    `https://omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&type=${type}&t=${title}`
  );
  return response;
}

const cachedGetOMDB = mem(getOMDB, {
  cacheKey: (arguments_) => arguments_.join(","),
  maxAge: 86400000, // 24 hours in milliseconds
});

fastify.get("/omdb", async (request, reply) => {
  handleRequest(request, reply, async ({ type, title }) => {
    return await cachedGetOMDB(type, title);
  });
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

const cachedExtractEmbedly = mem(extractEmbedly, {
  maxAge: 300000, // cache for 5 minutes
});

fastify.get("/embedly", async (request, reply) => {
  handleRequest(request, reply, async ({ url }) => {
    return await cachedExtractEmbedly(url);
  });
});

async function start() {
  try {
    await fastify.listen(process.env.PORT || 3000, "0.0.0.0");
    console.log("Server started");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
