require("dotenv").config();

const server = require("@tridnguyen/fastify-server")({
  auth0Domain: process.env.AUTH0_DOMAIN,
  auth0ClientId: process.env.AUTH0_CLIENT_ID,
  allowedOrigins: ["https://lab.tridnguyen.com", "https://tridnguyen.com"],
  shouldPerformJwtCheck: (request) => {
    // TODO change plaid to any future API that needs authentication
    if (request.url.includes("plaid")) {
      return true;
    }
  },
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
  const { type, title } = request.query;
  return await omdb(type, title);
});

server.get("/embedly", async (request, reply) => {
  const { url } = request.query;
  return await embedly(url);
});

async function start() {
  try {
    await server.listen(process.env.PORT || 3000, "0.0.0.0");
    console.log("Server started");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
