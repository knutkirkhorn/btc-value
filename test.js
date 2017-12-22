const btcValue = require('./');

btcValue(2.2).then((value) => {
    console.log('$' + value);
});

btcValue.getConvertedValue('NOK').then((value) => {
    console.log('kr' + value);
});