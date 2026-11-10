require("dotenv").config();

const server = require("@tridnguyen/fastify-server")({
  allowedOrigins: ["https://lab.tridnguyen.com", "https://tridnguyen.com"],
  // no routes currently require authentication
  shouldPerformJwtCheck: false,
});

const omdb = require("./lib/omdb");
const embedly = require("./lib/embedly");

server.setErrorHandler((err, req, reply) => {
  console.log("Default error handler", err);
  reply.send(err);
});

server.get("/", async (request, reply) => {
  reply.send("OK");
});

server.get("/omdb", async (request, reply) => {
  const { type, title, year } = request.query;
  return await omdb(type, title, year);
});

server.get("/embedly", async (request, reply) => {
  const { url } = request.query;
  return await embedly(url);
});

async function start() {
  try {
    await server.listen({ port: process.env.PORT || 3000, host: "0.0.0.0" });
    console.log("Server started");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
