'use strict';

const https = require('https');
const currencies = require('./currencies.json');
const baseUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC';
let apiKey = '';

function sendHttpRequest(urlParameters = '') {
    // Check if the api key is provided
    if (!apiKey) {
        throw new Error('`apiKey` needs to be set. Call `.setApiKey()` with your API key before calling other functions.');
    }

    const url = `${baseUrl}${urlParameters}&CMC_PRO_API_KEY=${apiKey}`;

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
                    const jsonResponse = JSON.parse(data);

                    // Check if there are errors in the API response
                    if (jsonResponse.status && jsonResponse.status.error_code !== 0) {
                        reject(new Error(`Error occurred while retrieving Bitcoin value: ${jsonResponse.status.error_message}`));
                    }

                    resolve(jsonResponse.data.BTC);
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

function setApiKey(key) {
    // Check if the API key is provided
    if (!key) {
        throw new Error('You need to provide an API key.');
    }

    apiKey = key;
}

function convertToTwoDecimals(number) {
    // Check if the number is not an integer. If it is not, convert it to two decimals.
    if (number % 1 !== 0) {
        return parseFloat(number.toFixed(2));
    }

    return number;
}

function parseOptions(currencyValue, options) {
    const {isDecimal, quantity} = options;

    // Set the new currency value if quantity is provided
    if (quantity) {
        currencyValue *= quantity;
    }

    // If `isDecimal` is false => return an integer
    if (!isDecimal) {
        currencyValue = parseInt(currencyValue, 10);
    }

    return convertToTwoDecimals(currencyValue);
}

function getValue(options) {
    return new Promise((resolve, reject) => {
        let urlParameters = '';

        // Set default value of `currencyCode` and `isDecimal`
        options = {
            currencyCode: 'USD',
            isDecimal: false,
            ...options
        };

        let {currencyCode} = options;
        const {isDecimal, quantity} = options;

        // Check that the type of `currencyCode` is `string`
        if (typeof currencyCode !== 'string') {
            throw new TypeError('`currencyCode` should be of type `string`');
        }

        // Ensure the currency code is uppercase
        currencyCode = currencyCode.toUpperCase();

        if (typeof isDecimal !== 'boolean') {
            throw new TypeError('`isDecimal` should be of type `boolean`');
        }

        if (quantity && typeof quantity !== 'number') {
            throw new TypeError('`quantity` should be of type `number`');
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
            urlParameters += `&convert=${currencyCode}`;
        }

        sendHttpRequest(urlParameters).then(response => {
            // Set the `currencyValue` to the `USD` value by default
            let currencyValue = (currencyCode === 'USD') ? response.quote.USD.price : response.quote[currencyCode].price;

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
        sendHttpRequest().then(response => {
            if (!response.quote || !response.quote.USD || (response.quote && !response.quote.USD[`percent_change_${type}`])) {
                throw new Error('Failed to retrieve percentage change');
            }

            const percentageChange = parseFloat(response.quote.USD[`percent_change_${type}`]);
            resolve(percentageChange);
            return;
        }).catch(error => reject(error));
    });
}

module.exports = options => getValue(options);

module.exports.setApiKey = key => setApiKey(key);

module.exports.getPercentageChangeLastHour = () => getPercentageChangeLastTime('1h');

module.exports.getPercentageChangeLastDay = () => getPercentageChangeLastTime('24h');

module.exports.getPercentageChangeLastWeek = () => getPercentageChangeLastTime('7d');

module.exports.currencies = currencies;