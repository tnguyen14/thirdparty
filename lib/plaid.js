const plaid = require("plaid");

const client = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  env: plaid.environments.development,
  options: {
    version: "2019-05-29",
  },
});

const ACCESS_TOKEN = process.env.PLAID_ACCESS_TOKEN;

async function accounts() {
  const resp = await client.getAccounts(ACCESS_TOKEN);
  return resp;
}

async function balance() {
  const resp = await client.getBalance(ACCESS_TOKEN);
  return resp;
}

module.exports = {
  accounts,
  balance,
};
