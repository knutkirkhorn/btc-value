'use strict';
const https = require('https');
const currencies = require('./currencies.json');

const apiURL = 'https://api.coinmarketcap.com/v1/ticker/bitcoin/';

function sendHttpRequest(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed to load url: ' + response.statusCode));
                return;
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

// input1 and input2 can both be boolean (isDouble) and number (quantity), but not the same type
function getValue(input1, input2) {
    return new Promise((resolve, reject) => {
        sendHttpRequest(apiURL).then(response => {
            let usdValue = response.price_usd;

            if (typeof input1 === 'number' && (typeof input2 === 'boolean' || 'undefined')) {
                if (input2 !== true) {
                    usdValue = parseInt(usdValue);
                }

                if (typeof input1 === 'number') {
                    usdValue *= input1;
                }
            } else if (typeof input1 === 'boolean' && (typeof input2 === 'number' || 'undefined')) {
                if (input1 !== true) {
                    usdValue = parseInt(usdValue);
                }
                
                if (typeof input2 === 'number') {
                    usdValue *= input2;
                }
            } else if (typeof input1 === 'undefined' && typeof input2 === 'undefined') {

            } else {
                reject(new Error('No available constructor for given input'));
                return;
            }
            
            // Check if the number is not a int => convert to 2 decimals
            if (usdValue % 1 !== 0) {
                usdValue = parseFloat(usdValue).toFixed(2);
            }

            if (!usdValue) {
                reject(new Error('Failed to retrieve Bitcoin value'));
                return;
            }
            resolve(usdValue);
        }).catch((error) => reject(error));
    });
}

// input1 and input2 can both be boolean (isDouble) and number (quantity), but not the same type
function getConvertedValue(currencyCode, input1, input2) {
    return new Promise((resolve, reject) => {
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
            return;
        }

        sendHttpRequest(apiURL + '?convert=' + currencyCode).then(response => {
            let currencyValue = response['price_' + currencyCode.toLowerCase()];

            if (typeof input1 === 'number' && (typeof input2 === 'boolean' || 'undefined')) {
                if (input2 !== true) {
                    currencyValue = parseInt(currencyValue);
                }

                if (typeof input1 === 'number') {
                    currencyValue *= input1;
                }
            } else if (typeof input1 === 'boolean' && (typeof input2 === 'number' || 'undefined')) {
                if (input1 !== true) {
                    currencyValue = parseInt(currencyValue);
                }
                
                if (typeof input2 === 'number') {
                    currencyValue *= input2;
                }
            } else if (typeof input1 === 'undefined' && typeof input2 === 'undefined') {

            } else {
                reject(new Error('No available constructor for given input'));
                return;
            }

            // Check if the number is not a int => convert to 2 decimals
            if (currencyValue % 1 !== 0) {
                currencyValue = parseFloat(currencyValue).toFixed(2);
            }
            
            if (!currencyValue) {
                reject(new Error('Failed to retrieve Bitcoin value'));
                return;
            }
            resolve(currencyValue);
        }).catch((error) => reject(error));
    });
}

function getPercentageChangeLastTime(type) {
    return new Promise((resolve, reject) => {
        sendHttpRequest(apiURL).then(response => {
            resolve(response['percent_change_' + type]);
        });
    });
}

module.exports = (input1, input2) => {
    return getValue(input1, input2);
}

module.exports.getConvertedValue = (currencyCode, input1, input2) => {
    return getConvertedValue(currencyCode, input1, input2);
};

module.exports.getPercentageChangeLastHour = () => {
    return getPercentageChangeLastTime('1h');
}

module.exports.getPercentageChangeLastDay = () => {
    return getPercentageChangeLastTime('24h');
}

module.exports.getPercentageChangeLastWeek = () => {
    return getPercentageChangeLastTime('7d');
}

module.exports.currencies = currencies;