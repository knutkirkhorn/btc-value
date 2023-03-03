// eslint-disable-next-line import/no-unresolved
import got from 'got';
import getPackageUserAgent from 'package-user-agent';

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
const packageUserAgent = await getPackageUserAgent();

export async function getSupportedCurrencies() {
	// Check if the api key is needed for the selected provider
	if (providers[selectedProvider].apiKeyRequired && !apiKey) {
		throw new Error('`apiKey` needs to be set if using CoinMarketCap. Call `.setApiKey()` with your API key before calling other functions.');
	}

	if (selectedProvider === 'cmc') {
		try {
			const jsonResponse = await got(`https://pro-api.coinmarketcap.com/v1/fiat/map?CMC_PRO_API_KEY=${apiKey}`).json();

			// Check if there are errors in the API response
			if (jsonResponse.status && jsonResponse.status.error_code !== 0) {
				throw new Error(`Failed to retrieve supported currencies: ${jsonResponse.status.error_message}`);
			}

			if (!jsonResponse.data) {
				throw new Error('Failed to retrieve supported currencies');
			}

			return jsonResponse.data;
		} catch {
			// If not able to parse JSON or get the supported currencies
			throw new Error('Failed to retrieve supported currencies');
		}
	}

	// Default to CoinGecko
	try {
		const supportedCurrenciesResponse = await got('https://api.coingecko.com/api/v3/simple/supported_vs_currencies').json();

		if (!Array.isArray(supportedCurrenciesResponse)) {
			// eslint-disable-next-line unicorn/prefer-type-error
			throw new Error('Failed to retrieve supported currencies');
		}

		return supportedCurrenciesResponse;
	} catch {
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
		const jsonResponse = await got(url, {headers: packageUserAgent}).json();

		// Check if there are errors in the API response
		if (jsonResponse.status && jsonResponse.status.error_code !== 0) {
			throw new Error(`Error occurred while retrieving Bitcoin value: ${jsonResponse.status.error_message}`);
		}

		return jsonResponse.data.BTC;
	} catch {
		// If not able to parse JSON or get the first parsed value
		throw new Error('Failed to retrieve Bitcoin value');
	}
}

export function setProvider(provider) {
	if (!Object.keys(providers).includes(provider)) {
		throw new Error('`provider` needs to be one of `cmc` and `coingecko`');
	}

	selectedProvider = provider;
}

export function setApiKey(newApiKey) {
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
		return Number.parseFloat(number.toFixed(2));
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
		currencyValue = Number.parseInt(currencyValue, 10);
	}

	return convertToTwoDecimals(currencyValue);
}

export default async function btcValue(options) {
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
			const jsonResponse = await got(`${providers[selectedProvider].baseUrl}&vs_currencies=${currencyCode}&precision=full`).json();

			if (!jsonResponse.bitcoin || !jsonResponse.bitcoin[currencyCode.toLowerCase()]) {
				throw new Error('Failed to retrieve Bitcoin value');
			}

			currencyValue = jsonResponse.bitcoin[currencyCode.toLowerCase()];
		} catch {
			throw new Error('Failed to retrieve Bitcoin value');
		}
	}

	currencyValue = Number(currencyValue);
	return parseOptions(currencyValue, options);
}

async function getPercentageChangeLastTime(type) {
	if (selectedProvider === 'cmc') {
		const response = await sendHttpRequest();

		if (!response.quote || !response.quote.USD || (response.quote && !response.quote.USD[`percent_change_${type}`])) {
			throw new Error('Failed to retrieve percentage change');
		}

		return Number.parseFloat(response.quote.USD[`percent_change_${type}`]);
	}

	// Default to CoinGecko
	const jsonResponse = await got(`https://api.coingecko.com/api/v3/coins/markets?ids=bitcoin&vs_currency=usd&price_change_percentage=${type}`).json();

	if (!jsonResponse[0] || !jsonResponse[0][`price_change_percentage_${type}_in_currency`]) {
		throw new Error('Failed to retrieve percentage change');
	}

	return Number.parseFloat(jsonResponse[0][`price_change_percentage_${type}_in_currency`]);
}

export async function getPercentageChangeLastHour() {
	return getPercentageChangeLastTime('1h');
}

export async function getPercentageChangeLastDay() {
	return getPercentageChangeLastTime('24h');
}

export async function getPercentageChangeLastWeek() {
	return getPercentageChangeLastTime('7d');
}
