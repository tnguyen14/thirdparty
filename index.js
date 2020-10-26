require("dotenv").config();

const server = require("@tridnguyen/fastify-server")({
  auth0Domain: process.env.AUTH0_DOMAIN,
  auth0ClientId: process.env.AUTH0_CLIENT_ID,
  allowedOrigins: ["https://lab.tridnguyen.com", "https://tridnguyen.com"],
  shouldPerformJwtCheck: (request) => {
    if (request.url.includes("plaid")) {
      return true;
    }
  },
});

const omdb = require("./lib/omdb");
const embedly = require("./lib/embedly");
const robinhood = require("./lib/robinhood");
const plaid = require("./lib/plaid");

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

server.get("/robinhood/*", async (request, reply) => {
  return await robinhood(request.params["*"], request.headers.authorization);
});

server.get("/plaid/accounts", async (request, reply) => {
  return await plaid.accounts();
});

server.get("/plaid/balance", async (request, reply) => {
  return await plaid.balance();
});

server.get("/plaid/transactions", async (request, reply) => {
  return await plaid.transactions(request.query);
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
