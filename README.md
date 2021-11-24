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
$ npm install btc-value
```

## Usage
```js
const btcValue = require('btc-value');

// Set the value provider
btcValue.setProvider('coingecko');

// Set the API key
btcValue.setApiKey('example-cmc-API-key');

// Print the current value of Bitcoin in USD
btcValue().then(value => {
    console.log('$' + value);
    // => e.g. $11048
});

// Print the current value as a decimal number if `isDecimal` is `true`
btcValue({isDecimal: true}).then(value => {
    console.log('$' + value);
    // => e.g. $11048.10
});

// Print the current value of Bitcoin in NOK (Norwegian krone)
btcValue({currencyCode: 'NOK'}).then(value => {
    console.log('kr ' + value);
    // => e.g. kr 86664
});

// Print the current value of 2.2 BTC in USD
btcValue({quantity: 2.2}).then(value => {
    console.log('$' + value);
    // => e.g. $24305.82
});

// Print the percentage change in BTC value the last day
btcValue.getPercentageChangeLastDay().then(percentage => {
    console.log(percentage + '%');
    // => e.g. 5%
});

// Print all supported currencies for selected value provider
btcValue.getSupportedCurrencies().then(supportedCurrencies => {
    console.log(supportedCurrencies);
    // => [ ..., { name: 'Norwegian Krone', code: 'NOK', symbol: 'kr' }, ... ]
});
```

## API
The Bitcoin value can be retrieved from [CoinMarketCap](https://coinmarketcap.com/) or [CoinGecko](https://www.coingecko.com). See the API used for CoinMarketCap [here](https://coinmarketcap.com/api/) and for CoinGecko [here](https://www.coingecko.com/en/api). If using the CoinMarketCap API to retrieve Bitcoin values, it is required to obtain and use an API key. This can be done [here](https://coinmarketcap.com/api/). Before using the functions for retrieving the Bitcoin value, one must then call `btcValue.setApiKey(<KEY_HERE>)` with your key. If using CoinGecko, this is not needed.

### btcValue([options])
Returns the current Bitcoin value in USD ($) as an `integer`.

#### options ***(optional)***
Type: `object`

##### isDecimal
Type: `boolean`<br>
Default: `false`

Returns the current Bitcoin value as a `decimal number` if `isDecimal` is `true`.

##### quantity
Type: `number`

Returns the current Bitcoin value of a specified `quantity`.

##### currencyCode
Type: `string`<br>
Default: `USD`

Returns the current Bitcoin value in a different currency than `USD`. All valid currency codes can be retrieved for the selected value provider using the `getSupportedCurrencies` function.

### btcValue.setProvider(provider)
Sets the selected provider to retrieve Bitcoin values from. Supported providers are: `cmc` (CoinMarketCap) and `coingecko`.

#### provider
Type: `string`<br>

### btcValue.setApiKey(apiKey)
Sets the API key for the selected value provider. Currently only CoinMarketCap supports using an API key. This is required to call the functions with the [CoinMarketCap API](https://coinmarketcap.com/api/).

#### apiKey
Type: `string`<br>

### btcValue.getPercentageChangeLastHour()
Returns the percentage change of BTC the last hour.

### btcValue.getPercentageChangeLastDay()
Returns the percentage change of BTC the last day.

### btcValue.getPercentageChangeLastWeek()
Returns the percentage change of BTC the last week.

### btcValue.getSupportedCurrencies()
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

## License
MIT © [Knut Kirkhorn](LICENSE)
