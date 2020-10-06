const plaid = require("plaid");
const dayjs = require("dayjs");

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

async function transactions(query) {
  const dateFormat = "YYYY-MM-DD";
  const endDate = dayjs(query.end);
  const startDate = endDate.subtract(query.days || 30, "days");
  const count = Math.min(Number(query.count) || 250, 500);
  const resp = await client.getTransactions(
    ACCESS_TOKEN,
    startDate.format(dateFormat),
    endDate.format(dateFormat),
    {
      count,
    }
  );
  return resp;
}

module.exports = {
  accounts,
  balance,
};
