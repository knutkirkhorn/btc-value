'use strict;'
const https = require('https');
const currencies = require('./currencies.json');

const apiURL = 'https://api.coinmarketcap.com/v1/ticker/bitcoin/';

function sendHttpRequest(url) {
    return new Promise( (resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed to load url: ' + res.statusCode));
            }

            response.setEncoding('UTF-8');
            let data = '';

            response.on('data', function(body) {
                data += body;
            });

            response.on('end', function() {
                resolve(JSON.parse(data)[0]);
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

function getValue(isDouble) {
    return new Promise( (resolve, reject) => {
        sendHttpRequest(apiURL)
            .then((response) => {
                let usdValue = response.price_usd;
                if (isDouble !== true) {
                    usdValue = parseInt(usdValue);
                }
                
                if (!usdValue) {
                    reject(new Error('Failed to retrieve Bitcoin value'));
                }
                resolve(usdValue);
            });
    });
}

function getConvertedValue(currencyCode, isDouble) {
    return new Promise( (resolve, reject) => {
        //Check if the current currency code mathches any valid ones
        let found = false;
        for (let i = 0; i < currencies.length; i++) {
            if (currencyCode.toUpperCase() === currencies[i].code) {
                found = true;
                break;
            }
        }

        if (!found) {
            reject(new Error('Please choose a valid currency code'));
        }

        sendHttpRequest(apiURL + '?convert=' + currencyCode)
            .then((response) => {
                let currencyValue = response['price_' + currencyCode.toLowerCase()];
                if (isDouble !== true) {
                    currencyValue = parseInt(currencyValue);
                }
                
                if (!currencyValue) {
                    reject(new Error('Failed to retrieve Bitcoin value'));
                }
                resolve(currencyValue);
            });
    });
}

module.exports = (isDouble) => {
    return getValue(isDouble);
}

module.exports.getConvertedValue = (currencyCode, isDouble) => {
    return getConvertedValue(currencyCode, isDouble);
};

module.exports.currencies = currencies;