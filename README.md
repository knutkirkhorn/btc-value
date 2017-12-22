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

// get the value of 2.2 BTC
btcValue(2.2).then((value) => {
    console.log('$' + value);
    // => $30685.60
});
```

## API
### btcValue()
Returns the current Bitcoin value in USD ($) as an ```integer```.
The btc value is from [Cryptocurrency Market Capitalizations](https://coinmarketcap.com/). See API [here](https://coinmarketcap.com/api/).

### btcValue(isDouble)
Returns the current Bitcoin value as an ```double``` if the ```boolean``` value is ```true```. Returns an ```integer``` otherwise.

### btcValue(quantity)
Returns the current Bitcoin value of a specified ```quantity```.

### btcValue(quantity, isDouble)
```quantity``` and ```isDouble``` works like the functions described over.

### btcValue(isDouble, quantity)
Same as the version over just switched positions of ```quantity``` and ```idDouble```. The module will understand which version is being used.

### btcValue.getConvertedValue(currencyCode)
Returns the current Bitcoin value in a different currency than USD. Returns an ```integer```. All valid currency codes are stored in the [currencies.json](currencies.json) file.

### btcValue.getConvertedValue(currencyCode, isDouble)
Returns the current Bitcoin value in a different currency as an ```double``` if the ```boolean``` value is ```true```. Returns an ```integer``` otherwise.

### btcValue.getConvertedValue(currencyCode, quantity)
Returns the current Bitcoin value in a different currency of a specified ```quantity```.

### btcValue.getConvertedValue(currencyCode, quantity, isDouble)
```quantity``` and ```isDouble``` works like the functions described over.

### btcValue.getConvertedValue(currencyCode, isDouble, quantity)
Same as the version over just switched positions of ```quantity``` and ```idDouble```. The module will understand which version is being used.

## Related
- [btc-value-cli](https://github.com/Knutakir/btc-value-cli) - CLI for this module

## Licence
MIT © [Knut Kirkhorn](LICENSE)
