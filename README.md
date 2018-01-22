<h1 align="center">
	<br>
	<br>
	<img width="360" src="https://rawgit.com/Knutakir/btc-value/master/media/logo.svg" alt="btc-value">
	<br>
	<br>
	<br>
</h1>

> Get the current Bitcoin value

[![Build Status](https://travis-ci.org/Knutakir/btc-value.svg?branch=master)](https://travis-ci.org/Knutakir/btc-value)

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
    // => e.g. $16258
});

// Print the current value in double if true is used as a parameter
btcValue(true).then(value => {
    console.log('$' + value);
    // => e.g. $14081.60
});

// Print the current value of Bitcoin in NOK (Norwegian krone)
btcValue.getConvertedValue('NOK').then(value => {
    console.log('kr ' + value);
    // => e.g. kr 158053
});

// Print the current value of 2.2 BTC in USD
btcValue(2.2).then(value => {
    console.log('$' + value);
    // => e.g. $30685.60
});

// Print the percentage change in BTC value the last day
btcValue.getPercentageChangeLastDay().then(percentage => {
    console.log(percentage + '%');
    // => e.g. -7.17%
});
```

## API
### btcValue()
Returns the current Bitcoin value in USD ($) as an `integer`.
The btc value is from [Cryptocurrency Market Capitalizations](https://coinmarketcap.com/). See API [here](https://coinmarketcap.com/api/).

### btcValue(isDouble)
#### isDouble
Type: `boolean`
Returns the current Bitcoin value as an `double` if `isDouble` is `true`. Returns an `integer` otherwise.

### btcValue(quantity)
Returns the current Bitcoin value of a specified `quantity`.

### btcValue(isDouble, quantity)
`quantity` and `isDouble` works like the functions described over.

### btcValue.getConvertedValue(currencyCode)
Returns the current Bitcoin value in a different currency than `USD`. Returns an `integer`. All valid currency codes are stored in the [currencies.json](currencies.json) file.

### btcValue.getConvertedValue(currencyCode, isDouble)
Returns the current Bitcoin value in a different currency as an `double` if `isDouble` is `true`. Returns an `integer` otherwise.

### btcValue.getConvertedValue(currencyCode, quantity)
Returns the current Bitcoin value in a different currency of a specified `quantity`.

### btcValue.getConvertedValue(currencyCode, isDouble, quantity)
`quantity` and `isDouble` works like the functions described over.

### btcValue.getPercentageChangeLastHour()
Return the percentage change of BTC the last hour.

### btcValue.getPercentageChangeLastDay()
Return the percentage change of BTC the last day.

### btcValue.getPercentageChangeLastWeek()
Return the percentage change of BTC the last week.

## Related
- [btc-value-cli](https://github.com/Knutakir/btc-value-cli) - CLI for this module

## License
MIT © [Knut Kirkhorn](LICENSE)
