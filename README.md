# btc-value
Get the current Bitcoin value

## Installation
```
$ npm install btc-value
```

## Usage
```js
const btcValue = require('btc-value');

btcValue().then((value) => {
    console.log('$' + value)
    // => displays the current value of Bitcoin in USD
    // => e.g. $16258
});

// use true as a parameter to get the value as a double
btcValue(true).then((value) => {
    console.log('$' + value)
    // => double value: $16258.2
});

// get value as NOK (Norwegian krone)
btcValue.getConvertedValue('NOK').then((value) => {
    console.log('kr ' + value);
    // => displays the current value in NOK (Norwegian krone) kr 158053
    // => e.g. kr 158053
});
```

## API
### btcValue()
Returns the current Bitcoin value in USD ($) as an ```integer```.
The btc value is from [Cryptocurrency Market Capitalizations](https://coinmarketcap.com/). See API [here](https://coinmarketcap.com/api/).

### btcValue(isDouble)
Returns the current Bitcoin value as an ```double``` if the ```boolean``` value is ```true```, otherwise the value is returned as ```integer```.

### btcValue.getConvertedValue(currencyCode)
Returns the current Bitcoin value in a different currency than USD. Returns an ```integer```. All valid currency codes are stored in the [currencies.json](currencies.json) file.

### btcValue.getConvertedValue(currencyCode, double)
Returns the current Bitcoin value in a different currency as an ```double``` if the ```boolean``` value is ```true```. Returns an ```integer``` otherwise. 

## Related
- [btc-value-cli](https://github.com/Knutakir/btc-value-cli) - CLI for this module

## Licence
MIT © [Knut Kirkhorn](LICENSE)
