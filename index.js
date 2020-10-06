require("dotenv").config();

const fastify = require("fastify")({
  ignoreTrailingSlash: true,
});

const omdb = require("./lib/omdb");
const embedly = require("./lib/embedly");
const robinhood = require("./lib/robinhood");
const plaid = require("./lib/plaid");

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
    const response = await fn(
      request.query,
      request.params,
      request.body,
      request.headers
    );
    reply.send(response);
  } catch (e) {
    console.error(e);
    reply.send(e);
  }
}

fastify.get("/", async (request, reply) => {
  reply.send("OK");
});

fastify.get("/omdb", async (request, reply) => {
  handleRequest(request, reply, async ({ type, title }) => {
    return await omdb(type, title);
  });
});

fastify.get("/embedly", async (request, reply) => {
  handleRequest(request, reply, async ({ url }) => {
    return await embedly(url);
  });
});

fastify.get("/robinhood/*", async (request, reply) => {
  handleRequest(request, reply, async (query, params, body, headers) => {
    return await robinhood(params["*"], headers.authorization);
  });
});

fastify.get("/plaid/balance", async (request, reply) => {
  handleRequest(request, reply, async () => {
    return await plaid.balance();
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
