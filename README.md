# btc-value
> Get the current Bitcoin value

## Installation
```
$ npm install btc-value
```

## Usage
```js
const btcValue = require('btc-value');

// Print the current value of Bitcoin in USD
btcValue().then(value => {
    console.log('$' + value)
    // => e.g. $16258
});

// Print the current value in double if true is used as a parameter
btcValue(true).then(value => {
    console.log('$' + value)
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
    // => $30685.60
});

// Print the percentage change in BTC value the last day
btcValue.getPercentageChangeLastDay().then(percentage => {
    console.log(percentage);
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
Same as the version over just switched positions of ```quantity``` and ```isDouble```. The module will understand which version is being used.

### btcValue.getConvertedValue(currencyCode)
Returns the current Bitcoin value in a different currency than USD. Returns an ```integer```. All valid currency codes are stored in the [currencies.json](currencies.json) file.

### btcValue.getConvertedValue(currencyCode, isDouble)
Returns the current Bitcoin value in a different currency as an ```double``` if the ```boolean``` value is ```true```. Returns an ```integer``` otherwise.

### btcValue.getConvertedValue(currencyCode, quantity)
Returns the current Bitcoin value in a different currency of a specified ```quantity```.

### btcValue.getConvertedValue(currencyCode, quantity, isDouble)
```quantity``` and ```isDouble``` works like the functions described over.

### btcValue.getConvertedValue(currencyCode, isDouble, quantity)
Same as the version over just switched positions of ```quantity``` and ```isDouble```. The module will understand which version is being used.

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
