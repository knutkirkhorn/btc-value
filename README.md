<h1 align="center">
	<br>
	<br>
	<img width="360" src="https://rawgit.com/Knutakir/btc-value/master/media/logo.svg" alt="btc-value">
	<br>
	<br>
	<br>
</h1>

> Get the current Bitcoin value

[![Build Status](https://travis-ci.org/Knutakir/btc-value.svg?branch=master)](https://travis-ci.org/Knutakir/btc-value) [![Downloads](https://img.shields.io/npm/dm/btc-value.svg)](https://www.npmjs.com/package/btc-value) [![Coverage Status](https://coveralls.io/repos/github/Knutakir/btc-value/badge.svg?branch=master)](https://coveralls.io/github/Knutakir/btc-value?branch=master)

## Installation
```
$ npm install btc-value
```

## Usage
```js
const btcValue = require('btc-value');

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

// Print all supported currencies
console.log(btcValue.currencies);
// => [ ..., { name: 'Norwegian Krone', code: 'NOK', symbol: 'kr' }, ... ]
```

## API
The Bitcoin value is from [Cryptocurrency Market Capitalizations](https://coinmarketcap.com/). See API [here](https://coinmarketcap.com/api/).
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

Returns the current Bitcoin value in a different currency than `USD`. All valid currency codes are stored in the [currencies.json](currencies.json) file.

### btcValue.getPercentageChangeLastHour()
Returns the percentage change of BTC the last hour.

### btcValue.getPercentageChangeLastDay()
Returns the percentage change of BTC the last day.

### btcValue.getPercentageChangeLastWeek()
Returns the percentage change of BTC the last week.

### btcValue.currencies
Returns an array with all the supported currencies specified in [currencies.json](currencies.json).
Example of the format for a single currency in the list:
```json
{
    "name": "Norwegian Krone",
    "code": "NOK",
    "symbol": "kr"
}
```

## Related
- [btc-value-cli](https://github.com/Knutakir/btc-value-cli) - CLI for this module

## License
MIT © [Knut Kirkhorn](LICENSE)
