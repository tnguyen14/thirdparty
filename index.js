require("dotenv").config();

const fastify = require("fastify")({
  ignoreTrailingSlash: true,
});

let auth;

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
    const response = await fn(request.params, request.body);
    reply.send(response);
  } catch (e) {
    console.error(e);
    reply.send(e);
  }
}

fastify.get("/", async (request, reply) => {
  reply.send("OK");
});

fastify.get("/omdb", async (request, reply) => {});

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
