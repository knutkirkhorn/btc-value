'use strict';
const https = require('https');
const currencies = require('./currencies.json');

const apiURL = 'https://api.coinmarketcap.com/v1/ticker/bitcoin/';

function sendHttpRequest(url) {
    return new Promise((resolve, reject) => {
        https.get(url, response => {
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
                try {
                    resolve(JSON.parse(data)[0]);
                } catch(err) {
                    // If not able to parse JSON or get the first parsed value
                    reject(new Error('Failed to retrieve Bitcoin value'));
                    return;
                }
            });
        }).on('error', error => {
            reject(error);
        });
    });
}

function convertToTwoDecimals(number) {
    // Check if the number is not a int => convert to 2 decimals
    if (number % 1 !== 0) {
        return parseFloat(number).toFixed(2);
    }
    return number;
}

// input1 can both be boolean (isDouble) and number (quantity), but not the same type
// input2 can be boolean (isDouble) if input1 is number (quantity)
function getValue(input1, input2) {
    return new Promise((resolve, reject) => {
        sendHttpRequest(apiURL).then(response => {
            let usdValue = response.price_usd;

            if (typeof input1 === 'number' && typeof input2 === 'undefined') {
                usdValue *= input1;
            } else if (typeof input1 === 'boolean' && (typeof input2 === 'number' || 'undefined')) {
                if (input1 !== true) {
                    usdValue = parseInt(usdValue);
                }

                if (typeof input2 === 'number') {
                    usdValue *= input2;
                }
            } else if (typeof input1 === 'undefined' && typeof input2 === 'undefined') {
                usdValue = parseInt(usdValue);
            } else {
                reject(new Error('Not valid input'));
                return;
            }

            if (!usdValue) {
                reject(new Error('Failed to retrieve Bitcoin value'));
                return;
            }
            usdValue = convertToTwoDecimals(usdValue);
            resolve(usdValue);
        }).catch(error => reject(error));
    });
}

// input1 can both be boolean (isDouble) and number (quantity), but not the same type
// input2 can be boolean (isDouble) if input1 is number (quantity)
function getConvertedValue(currencyCode, input1, input2) {
    return new Promise((resolve, reject) => {
        // Check that the type of `currencyCode` is 'string'
        if (typeof currencyCode !== 'string') {
            reject(new Error('Currency code needs to be a string'));
            return;
        }

        // Check if the current currency code mathches any valid ones
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

            if (typeof input1 === 'number' && typeof input2 === 'undefined') {
                currencyValue *= input1;
            } else if (typeof input1 === 'boolean' && (typeof input2 === 'number' || 'undefined')) {
                if (input1 !== true) {
                    currencyValue = parseInt(currencyValue);
                }

                if (typeof input2 === 'number') {
                    currencyValue *= input2;
                }
            } else if (typeof input1 === 'undefined' && typeof input2 === 'undefined') {
                currencyValue = parseInt(currencyValue);
            } else {
                reject(new Error('Not valid input'));
                return;
            }
            
            if (!currencyValue) {
                reject(new Error('Failed to retrieve Bitcoin value'));
                return;
            }
            currencyValue = convertToTwoDecimals(currencyValue);
            resolve(currencyValue);
        }).catch(error => reject(error));
    });
}

function getPercentageChangeLastTime(type) {
    return new Promise((resolve, reject) => {
        sendHttpRequest(apiURL).then(response => {
            try {
                const percentageChange = parseFloat(response['percent_change_' + type]);
                resolve(percentageChange);
            } catch(err) {
                reject(new Error('Failed to retrieve percentage change'));
                return;
            }
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