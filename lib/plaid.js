const plaid = require("plaid");

const client = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  env: plaid.environments.development,
  options: {
    version: "2019-05-29",
  },
});

async function balance() {
  const resp = await client.getBalance(process.env.PLAID_ACCESS_TOKEN);
  return resp;
}

module.exports = {
  balance,
};
