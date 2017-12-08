# btc-value
Get the current Bitcoin value

## Installation
```
$ npm install btc-value
```

## Usage
```js
const btcValue = require('btc-value');

btcValue()
    .then((value) => {
        console.log('$' + value)
        // => displays the current value of Bitcoin in USD
        // => e.g. $16258
    });

// use true as a parameter to get the value as a double
btcValue(true)
    .then((value) => {
        console.log('$' + value)
        // => double value: $16258.2
    });
```

## API
### btcValue()
Returns the current Bitcoin value in USD ($) as an ```integer```.
The btc value is from [Cryptocurrency Market Capitalizations](https://coinmarketcap.com/). See API [here](https://coinmarketcap.com/api/).
### btcValue(double)
Returns the current Bitcoin value as an ```double``` if the ```boolean``` value is ```true```.

## Licence
MIT © [Knut Kirkhorn](LICENSE)