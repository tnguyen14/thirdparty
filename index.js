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
  console.log(response);
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

async function start() {
  try {
    await fastify.listen(process.env.PORT || 3000, "0.0.0.0");
    console.log("Server started", {
      env: process.env,
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
