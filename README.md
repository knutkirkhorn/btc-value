<h1 align="center">
	<br>
	<br>
	<img width="360" src="https://raw.githubusercontent.com/knutkirkhorn/btc-value/main/media/logo.svg" alt="btc-value">
	<br>
	<br>
	<br>
</h1>

> Get the current Bitcoin value

[![Downloads](https://img.shields.io/npm/dm/btc-value.svg)](https://www.npmjs.com/package/btc-value) [![Coverage Status](https://codecov.io/gh/knutkirkhorn/btc-value/branch/main/graph/badge.svg)](https://codecov.io/gh/knutkirkhorn/btc-value)

## Installation

```
npm install btc-value
```

## Usage

```js
import btcValue, {
	setProvider,
	setApiKey,
	getPercentageChangeLastDay,
	getSupportedCurrencies
} from 'btc-value';

// Set the value provider
setProvider('coingecko');

// Set the API key
setApiKey('example-cmc-API-key');

// Print the current value of Bitcoin in USD
console.log(`$${await btcValue()}`);
// => e.g. $11048

// Print the current value of Bitcoin in NOK (Norwegian krone)
console.log(`kr ${await btcValue('NOK')}`);
// => e.g. kr 86664

// Print the current value of 2.2 BTC in USD
console.log(`$${await btcValue({quantity: 2.2})}`);
// => e.g. $24305.82

// Print the percentage change in BTC value the last day
console.log(`${await getPercentageChangeLastDay()} %`);
// => e.g. 5%

// Print all supported currencies for selected value provider
console.log(await getSupportedCurrencies());
// => cmc: [ ..., { name: 'Norwegian Krone', code: 'NOK', symbol: 'kr' }, ... ]
// => coingecko: [ ..., 'nok', ... ]
```

## API

The Bitcoin value can be retrieved from [CoinMarketCap](https://coinmarketcap.com/) or [CoinGecko](https://www.coingecko.com). See the API used for CoinMarketCap [here](https://coinmarketcap.com/api/) and for CoinGecko [here](https://www.coingecko.com/en/api). If using the CoinMarketCap API to retrieve Bitcoin values, it is required to obtain and use an API key. This can be done [here](https://coinmarketcap.com/api/). Before using the functions for retrieving the Bitcoin value, one must then call `btcValue.setApiKey(<KEY_HERE>)` with your key. If using CoinGecko, this is not needed.

### btcValue(currencyCode?)

Returns the current Bitcoin value in USD ($).

#### currencyCode

Type: `string`<br>
Default: `USD`

Returns the current Bitcoin value in a different currency than `USD`. All valid currency codes can be retrieved for the selected value provider using the `getSupportedCurrencies` function.

### setProvider(provider)

Sets the selected provider to retrieve Bitcoin values from. Supported providers are: `cmc` (CoinMarketCap) and `coingecko`.

#### provider

Type: `string`<br>

### setApiKey(apiKey)

Sets the API key for the selected value provider. Currently only CoinMarketCap supports using an API key. This is required to call the functions with the [CoinMarketCap API](https://coinmarketcap.com/api/).

#### apiKey

Type: `string`<br>

### getPercentageChangeLastHour()

Returns the percentage change of BTC the last hour.

### getPercentageChangeLastDay()

Returns the percentage change of BTC the last day.

### getPercentageChangeLastWeek()

Returns the percentage change of BTC the last week.

### getSupportedCurrencies()

Returns an array with all the supported currencies for the selected value provider.
Example of the format for a single currency in the list using CoinMarketCap:

```json
{
    "name": "Norwegian Krone",
    "code": "NOK",
    "symbol": "kr"
}

```

Example of a returned array using CoinGecko:

```js
['btc', 'eth']
```

## Related

- [btc-value-cli](https://github.com/knutkirkhorn/btc-value-cli) - CLI for this module
