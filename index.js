'use strict';

const got = require('got');

const providers = {
    cmc: {
        apiKeyRequired: true,
        baseUrl: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC'
    },
    coingecko: {
        apiKeyRequired: false,
        baseUrl: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin'
    }
};

let apiKey = '';
let selectedProvider = 'coingecko';
const httpHeader = {
    'User-Agent': 'btc-value (https://github.com/knutkirkhorn/btc-value)'
};

async function getSupportedCurrencies() {
    // Check if the api key is needed for the selected provider
    if (providers[selectedProvider].apiKeyRequired && !apiKey) {
        throw new Error('`apiKey` needs to be set if using CoinMarketCap. Call `.setApiKey()` with your API key before calling other functions.');
    }

    if (selectedProvider === 'cmc') {
        try {
            const {body} = await got(`https://pro-api.coinmarketcap.com/v1/fiat/map?CMC_PRO_API_KEY=${apiKey}`);
            const jsonResponse = JSON.parse(body);

            // Check if there are errors in the API response
            if (jsonResponse.status && jsonResponse.status.error_code !== 0) {
                throw new Error(`Failed to retrieve supported currencies: ${jsonResponse.status.error_message}`);
            }

            if (!jsonResponse.data) {
                throw new Error('Failed to retrieve supported currencies');
            }

            return jsonResponse.data;
        } catch (error) {
            // If not able to parse JSON or get the supported currencies
            throw new Error('Failed to retrieve supported currencies');
        }
    }

    // Default to CoinGecko
    try {
        const {body} = await got('https://api.coingecko.com/api/v3/simple/supported_vs_currencies');
        const jsonResponse = JSON.parse(body);

        if (!Array.isArray(jsonResponse)) {
            throw new Error('Failed to retrieve supported currencies');
        }

        return jsonResponse;
    } catch (error) {
        // If not able to parse JSON or get the supported currencies
        throw new Error('Failed to retrieve supported currencies');
    }
}

async function sendHttpRequest(urlParameters = '') {
    // Check if the api key is needed for the selected provider
    if (providers[selectedProvider].apiKeyRequired && !apiKey) {
        throw new Error('`apiKey` needs to be set if using CoinMarketCap. Call `.setApiKey()` with your API key before calling other functions.');
    }

    const {baseUrl} = providers[selectedProvider];
    const url = `${baseUrl}${urlParameters}&CMC_PRO_API_KEY=${apiKey}`;

    try {
        const {body} = await got(url, {headers: httpHeader});
        const jsonResponse = JSON.parse(body);

        // Check if there are errors in the API response
        if (jsonResponse.status && jsonResponse.status.error_code !== 0) {
            throw new Error(`Error occurred while retrieving Bitcoin value: ${jsonResponse.status.error_message}`);
        }

        return jsonResponse.data.BTC;
    } catch (error) {
        // If not able to parse JSON or get the first parsed value
        throw new Error('Failed to retrieve Bitcoin value');
    }
}

function setProvider(provider) {
    if (!Object.keys(providers).includes(provider)) {
        throw new Error('`provider` needs to be one of `cmc` and `coingecko`');
    }

    selectedProvider = provider;
}

function setApiKey(newApiKey) {
    // Check if the API key is provided
    if (!newApiKey) {
        throw new Error('You need to provide an API key.');
    }

    // Check that the type of `apiKey` is `string`
    if (typeof newApiKey !== 'string') {
        throw new TypeError('`apiKey` should be of type `string`');
    }

    apiKey = newApiKey;
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

async function getValue(options) {
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

    let currencyValue;

    if (selectedProvider === 'cmc') {
        if (currencyCode !== 'USD') {
            urlParameters += `&convert=${currencyCode}`;
        }

        const response = await sendHttpRequest(urlParameters);

        // Set the `currencyValue` to the value for the specified currency
        currencyValue = response.quote[currencyCode].price;

        if (!currencyValue) {
            throw new Error('Failed to retrieve Bitcoin value');
        }
    } else {
        // Default to CoinGecko
        try {
            const {body} = await got(`${providers[selectedProvider].baseUrl}&vs_currencies=${currencyCode}`);
            const jsonResponse = JSON.parse(body);

            if (!jsonResponse.bitcoin || !jsonResponse.bitcoin[currencyCode.toLowerCase()]) {
                throw new Error('Failed to retrieve Bitcoin value');
            }

            currencyValue = jsonResponse.bitcoin[currencyCode.toLowerCase()];
        } catch (error) {
            throw new Error('Failed to retrieve Bitcoin value');
        }
    }

    currencyValue = Number(currencyValue);
    currencyValue = parseOptions(currencyValue, options);
    return currencyValue;
}

async function getPercentageChangeLastTime(type) {
    if (selectedProvider === 'cmc') {
        const response = await sendHttpRequest();

        if (!response.quote || !response.quote.USD || (response.quote && !response.quote.USD[`percent_change_${type}`])) {
            throw new Error('Failed to retrieve percentage change');
        }

        const percentageChange = parseFloat(response.quote.USD[`percent_change_${type}`]);
        return percentageChange;
    }

    // Default to CoinGecko
    const {body} = await got(`https://api.coingecko.com/api/v3/coins/markets?ids=bitcoin&vs_currency=usd&price_change_percentage=${type}`);
    const jsonResponse = JSON.parse(body);

    if (!jsonResponse[0] || !jsonResponse[0][`price_change_percentage_${type}_in_currency`]) {
        throw new Error('Failed to retrieve percentage change');
    }

    const percentageChange = parseFloat(jsonResponse[0][`price_change_percentage_${type}_in_currency`]);
    return percentageChange;
}

module.exports = options => getValue(options);
module.exports.setApiKey = key => setApiKey(key);
module.exports.setProvider = provider => setProvider(provider);
module.exports.getPercentageChangeLastHour = () => getPercentageChangeLastTime('1h');
module.exports.getPercentageChangeLastDay = () => getPercentageChangeLastTime('24h');
module.exports.getPercentageChangeLastWeek = () => getPercentageChangeLastTime('7d');
module.exports.getSupportedCurrencies = getSupportedCurrencies;
