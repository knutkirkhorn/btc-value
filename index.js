'use strict';

const https = require('https');
const currencies = require('./currencies.json');
const apiURL = 'https://api.coinmarketcap.com/v1/ticker/bitcoin/';

function sendHttpRequest(url) {
    return new Promise((resolve, reject) => {
        https.get(url, response => {
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error(`Failed to load url: ${response.statusCode}`));
                return;
            }

            response.setEncoding('UTF-8');
            let data = '';

            response.on('data', body => {
                data += body;
            });

            response.on('end', () => {
                try {
                    resolve(JSON.parse(data)[0]);
                } catch (error) {
                    // If not able to parse JSON or get the first parsed value
                    reject(new Error('Failed to retrieve Bitcoin value'));
                    return;
                }
            });
        }).on('error', error => {
            reject(error);
            return;
        });
    });
}

function convertToTwoDecimals(number) {
    // Check if the number is not a int => convert to 2 decimals
    if (number % 1 !== 0) {
        return parseFloat(number.toFixed(2));
    }

    return number;
}

function parseOptions(currencyValue, options) {
    const {isDecimal, quantity} = options;

    if (typeof isDecimal !== 'boolean') {
        throw new TypeError('`isDecimal` should be of type `boolean`');
    }

    if (quantity) {
        if (typeof quantity !== 'number') {
            throw new TypeError('`quantity` should be of type `number`');
        }

        currencyValue *= quantity;
    }

    // If `isDecimal` is false => return an integer
    if (!isDecimal) {
        currencyValue = parseInt(currencyValue, 10);
    }

    return convertToTwoDecimals(currencyValue);
}

// input1 can both be boolean (isDecimal) and number (quantity), but not the same type
// input2 can be boolean (isDecimal) if input1 is number (quantity)
// TODO: new text here

function getValue(options) {
    return new Promise((resolve, reject) => {
        let url = apiURL;

        // Set default value of `currencyCode` and `isDecimal`
        options = {
            currencyCode: 'USD',
            isDecimal: false,
            ...options
        };

        const {currencyCode} = options;

        // Check that the type of `currencyCode` is `string`
        if (typeof currencyCode !== 'string') {
            throw new TypeError('`currencyCode` should be of type `string`');
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
            reject(new Error('Please choose a valid `currencyCode`'));
            return;
        }

        if (currencyCode !== 'USD') {
            url += `?convert=${currencyCode}`;
        }

        sendHttpRequest(url).then(response => {
            // Set the `currencyValue` to the `USD` value by default
            let currencyValue = (currencyCode === 'USD') ? response.price_usd : response[`price_${currencyCode.toLowerCase()}`];

            if (!currencyValue) {
                reject(new Error('Failed to retrieve Bitcoin value'));
                return;
            }

            currencyValue = Number(currencyValue);
            currencyValue = parseOptions(currencyValue, options);
            resolve(currencyValue);
            return;
        }).catch(error => reject(error));
    });
}

function getPercentageChangeLastTime(type) {
    return new Promise((resolve, reject) => {
        sendHttpRequest(apiURL).then(response => {
            try {
                if (!response[`percent_change_${type}`]) {
                    throw new Error('Failed to retrieve percentage change');
                }

                const percentageChange = parseFloat(response[`percent_change_${type}`]);
                resolve(percentageChange);
                return;
            } catch (error) {
                reject(new Error('Failed to retrieve percentage change'));
                return;
            }
        });
    });
}

module.exports = options => getValue(options);

module.exports.getPercentageChangeLastHour = () => getPercentageChangeLastTime('1h');

module.exports.getPercentageChangeLastDay = () => getPercentageChangeLastTime('24h');

module.exports.getPercentageChangeLastWeek = () => getPercentageChangeLastTime('7d');

module.exports.currencies = currencies;