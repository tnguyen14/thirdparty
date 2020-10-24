# thirdparty

## Usage

`https://thirdparty.cloud.tridnguyen.com/`

### Services

- Embedly `/embedly`
- OMDB `/omdb`
- Robinhood `/robinhood`
- Plaid `/plaid`
  - `/accounts`
  - `/balance`
  - `/transactions?days=1&end=2020-10-24&count=250`
    - `days`: Number of days to go back, starting at `end`, default to `30`.
    - `end`: Date - any date parseable by https://day.js.org/docs/en/parse/parse, default to today.
    - `count`: Number of transactions, default to 250, max at 500.
