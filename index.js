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

server.get("/", async (request, reply) => {
  reply.send("OK");
});

server.get("/omdb", async (request, reply) => {
  handleRequest(request, reply, async ({ type, title }) => {
    return await omdb(type, title);
  });
});

server.get("/embedly", async (request, reply) => {
  handleRequest(request, reply, async ({ url }) => {
    return await embedly(url);
  });
});

server.get("/robinhood/*", async (request, reply) => {
  handleRequest(request, reply, async (query, params, body, headers) => {
    return await robinhood(params["*"], headers.authorization);
  });
});

server.get("/plaid/accounts", async (request, reply) => {
  handleRequest(request, reply, async () => {
    return await plaid.accounts();
  });
});

server.get("/plaid/balance", async (request, reply) => {
  handleRequest(request, reply, async () => {
    return await plaid.balance();
  });
});

server.get("/plaid/transactions", async (request, reply) => {
  handleRequest(request, reply, async (query) => {
    return await plaid.transactions(query);
  });
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
