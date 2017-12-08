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
        // => display the current value of Bitcoin in USD
    });
```

## API
### btcValue()
Returns the current Bitcoin value in USD ($).
The btc value is from [Cryptocurrency Market Capitalizations](https://coinmarketcap.com/). See API [here](https://coinmarketcap.com/api/).

## Licence
MIT © [Knut Kirkhorn](LICENSE)