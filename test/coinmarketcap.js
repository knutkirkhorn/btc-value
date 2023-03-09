// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import nock from 'nock';
import btcValue, {
	getPercentageChangeLastDay,
	getPercentageChangeLastHour,
	getPercentageChangeLastWeek,
	getSupportedCurrencies,
	setApiKey,
	setProvider
} from '../index.js';

test.before(async t => {
	const expectedResult = new Error('`apiKey` needs to be set if using CoinMarketCap. Call `.setApiKey()` with your API key before calling other functions.');
	setProvider('cmc');

	// Check that the function can not be called without an API key for `cmc` as provider
	// This will throw an error
	try {
		await btcValue();
		t.fail();
	} catch (error) {
		t.deepEqual(error, expectedResult);
	}

	// Check that the function can not be called without an API key for `cmc` as provider
	// This will throw an error
	try {
		await getSupportedCurrencies();
		t.fail();
	} catch (error) {
		t.deepEqual(error, expectedResult);
	}

	// Set an example API key for all remaining tests
	setApiKey('example-CMC-PRO-API-key');
});

test.after(() => {
	// Clean all nocks
	nock.cleanAll();
});

test.beforeEach(() => {
	nock('https://pro-api.coinmarketcap.com')
		.get(/v1\/cryptocurrency\/quotes\/latest/)
		.reply(200, {
			status: {
				error_code: 0,
				// eslint-disable-next-line unicorn/no-null
				error_message: null
			},
			data: {
				BTC: {
					quote: {
						USD: {
							price: 8983.347_364_01,
							percent_change_1h: -1.670_74,
							percent_change_24h: -1.0296,
							percent_change_7d: 3.725_73
						},
						NOK: {
							price: 83_110.918_352_958_32,
							percent_change_1h: -1.731_48,
							percent_change_24h: -1.056_104_61,
							percent_change_7d: 2.127_939_14
						}
					}
				}
			}
		});
});

test('set `cmc` as provider', t => {
	try {
		setProvider('cmc');
		t.pass();
	} catch {
		t.fail();
	}
});

test('returned value is a number', async t => {
	try {
		const value = await btcValue();
		t.is(typeof value, 'number');
	} catch {
		t.fail();
	}
});

test('percentage last hour return a number', async t => {
	try {
		const value = await getPercentageChangeLastHour();
		t.is(typeof value, 'number');

		if (Number.isNaN(value)) {
			t.fail();
		}
	} catch {
		t.fail();
	}
});

test('percentage last day return a number', async t => {
	try {
		const value = await getPercentageChangeLastDay();

		t.is(typeof value, 'number');
		if (Number.isNaN(value)) {
			t.fail();
		}
	} catch {
		t.fail();
	}
});

test('percentage last week return a number', async t => {
	try {
		const value = await getPercentageChangeLastWeek();
		t.is(typeof value, 'number');

		if (Number.isNaN(value)) {
			t.fail();
		}
	} catch {
		t.fail();
	}
});

test('return number when `currencyCode` is `USD`', async t => {
	try {
		const value = await btcValue('USD');

		t.is(typeof value, 'number');
	} catch {
		t.fail();
	}
});

test('supported currencies returns array of `cmc` currency objects', async t => {
	const expectedResult = [
		{
			id: 2781,
			name: 'United States Dollar',
			sign: '$',
			symbol: 'USD'
		},
		{
			id: 2782,
			name: 'Australian Dollar',
			sign: '$',
			symbol: 'AUD'
		}
	];

	nock.cleanAll();
	nock('https://pro-api.coinmarketcap.com')
		.get(/v1\/fiat\/map/)
		.reply(200, {
			data: [
				{
					id: 2781,
					name: 'United States Dollar',
					sign: '$',
					symbol: 'USD'
				},
				{
					id: 2782,
					name: 'Australian Dollar',
					sign: '$',
					symbol: 'AUD'
				}
			]
		});

	try {
		const supportedCurrencies = await getSupportedCurrencies();
		t.is(typeof supportedCurrencies, 'object');
		t.deepEqual(supportedCurrencies, expectedResult);
	} catch (error) {
		t.is(error, '');
		t.fail();
	}
});

test('server return invalid response for supported currencies', async t => {
	const expectedResult = new Error('Failed to retrieve supported currencies');

	nock.cleanAll();

	nock('https://pro-api.coinmarketcap.com')
		.get(/v1\/fiat\/map/)
		.reply(200, {
			invalid_response: 'here'
		});

	try {
		await getSupportedCurrencies();
		t.fail();
	} catch (error) {
		t.deepEqual(error, expectedResult);
	}
});

test('server return invalid HTTP status code (123) for supported currencies', async t => {
	const expectedResult = new Error('Failed to retrieve supported currencies');

	nock.cleanAll();

	nock('https://pro-api.coinmarketcap.com')
		.get(/v1\/fiat\/map/)
		.reply(123, {
			invalid_response: 'here'
		});

	try {
		await getSupportedCurrencies();
		t.fail();
	} catch (error) {
		t.deepEqual(error, expectedResult);
	}
});

test('throws error if API key is invalid for supported currencies', async t => {
	const expectedResult = new Error('Failed to retrieve supported currencies');

	nock.cleanAll();

	nock('https://pro-api.coinmarketcap.com')
		.get(/v1\/fiat\/map/)
		.reply(200, {
			status: {
				error_code: 1001,
				error_message: 'This API Key is invalid.'
			}
		});

	try {
		await getSupportedCurrencies();
		t.fail();
	} catch (error) {
		t.deepEqual(error, expectedResult);
	}
});

test('server return invalid data response', async t => {
	const expectedResult = new Error('Failed to retrieve Bitcoin value');

	nock.cleanAll();

	nock('https://pro-api.coinmarketcap.com')
		.get(/v1\/cryptocurrency\/quotes\/latest/)
		.reply(200, {
			invalid_response: 'here'
		});

	try {
		await btcValue();
		t.fail();
	} catch (error) {
		t.deepEqual(error, expectedResult);
	}
});

test('server return non-JSON response', async t => {
	const expectedResult = new Error('Failed to retrieve Bitcoin value');

	nock.cleanAll();

	nock('https://pro-api.coinmarketcap.com')
		.get(/v1\/cryptocurrency\/quotes\/latest/)
		.reply(200, 'no_json here');

	try {
		await btcValue();
		t.fail();
	} catch (error) {
		t.deepEqual(error, expectedResult);
	}
});

test('server return invalid HTTP status code (123)', async t => {
	const expectedResult = new Error('Failed to retrieve Bitcoin value');

	nock.cleanAll();

	nock('https://pro-api.coinmarketcap.com')
		.get(/v1\/cryptocurrency\/quotes\/latest/)
		.reply(123, {
			invalid_response: 'here'
		});

	try {
		await btcValue();
		t.fail();
	} catch (error) {
		t.deepEqual(error, expectedResult);
	}
});

test('server return invalid HTTP status code (1337)', async t => {
	const expectedResult = new Error('Failed to retrieve Bitcoin value');

	nock.cleanAll();

	nock('https://pro-api.coinmarketcap.com')
		.get(/v1\/cryptocurrency\/quotes\/latest/)
		.reply(1337, {
			invalid_response: 'here'
		});

	try {
		await btcValue();
		t.fail();
	} catch (error) {
		t.deepEqual(error, expectedResult);
	}
});

test('server return error code', async t => {
	const expectedResult = new Error('Failed to retrieve Bitcoin value');

	nock.cleanAll();

	nock('https://pro-api.coinmarketcap.com')
		.get(/v1\/cryptocurrency\/quotes\/latest/)
		.replyWithError({
			errno: 'ECONNREFUSED',
			code: 'ECONNREFUSED',
			syscall: 'connect'
		});

	try {
		await btcValue();
		t.fail();
	} catch (error) {
		t.deepEqual(error, expectedResult);
	}
});

test('server return missing data (missing `price_usd`)', async t => {
	const expectedResult = new Error('Failed to retrieve Bitcoin value');

	nock.cleanAll();

	nock('https://pro-api.coinmarketcap.com')
		.get(/v1\/cryptocurrency\/quotes\/latest/)
		.reply(200, [
			{
				missing_data: 'here'
			}
		]);

	try {
		await btcValue();
		t.fail();
	} catch (error) {
		t.deepEqual(error, expectedResult);
	}
});

test('server return missing data (missing percent change)', async t => {
	const expectedResult = new Error('Failed to retrieve percentage change');

	nock.cleanAll();

	nock('https://pro-api.coinmarketcap.com')
		.get(/v1\/cryptocurrency\/quotes\/latest/)
		.reply(200, {
			data:
			{
				BTC: {
					missing_data: 'here'
				}
			}
		});

	try {
		await getPercentageChangeLastWeek();
		t.fail();
	} catch (error) {
		t.deepEqual(error, expectedResult);
	}
});

test('throws error if API key is invalid', async t => {
	const expectedResult = new Error('Failed to retrieve Bitcoin value');

	nock.cleanAll();

	nock('https://pro-api.coinmarketcap.com')
		.get(/v1\/cryptocurrency\/quotes\/latest/)
		.reply(200, {
			status: {
				error_code: 1001,
				error_message: 'This API Key is invalid.'
			}
		});

	try {
		await btcValue();
		t.fail();
	} catch (error) {
		t.deepEqual(error, expectedResult);
	}
});

test('server return missing data (missing currency value)', async t => {
	const expectedResult = new Error('Failed to retrieve Bitcoin value');

	nock.cleanAll();

	nock('https://pro-api.coinmarketcap.com')
		.get(/v1\/cryptocurrency\/quotes\/latest/)
		.reply(200, {
			data: {
				BTC: {
					quote: {
						USD: {
							something_else: 'here'
						}
					}
				}
			}
		});

	try {
		await btcValue();
		t.fail();
	} catch (error) {
		t.deepEqual(error, expectedResult);
	}
});
