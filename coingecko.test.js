const test = require('ava');
const nock = require('nock');
const btcValue = require('.');

test.before(() => {
    // Use CoinGecko as provider for these tests
    btcValue.setProvider('coingecko');
});

test.after(() => {
    // Clean all nocks
    nock.cleanAll();
});

test('set `coingecko` as provider', t => {
    try {
        btcValue.setProvider('coingecko');
        t.pass();
    } catch (error) {
        t.fail();
    }
});

test('supported currencies returns array of `coingecko` currency strings', async t => {
    const expectedResult = ['btc', 'eth', 'ltc', 'bch', 'bnb'];

    nock.cleanAll();
    nock('https://api.coingecko.com')
        .get(/api\/v3\/simple\/supported_vs_currencies/)
        .reply(200, ['btc', 'eth', 'ltc', 'bch', 'bnb']);

    try {
        const supportedCurrencies = await btcValue.getSupportedCurrencies();
        t.deepEqual(supportedCurrencies, expectedResult);
    } catch (error) {
        t.is(error, '');
        t.fail();
    }
});

test('server return invalid HTTP status code (123) for supported currencies', async t => {
    const expectedResult = new Error('Failed to retrieve supported currencies');

    nock.cleanAll();

    nock('https://api.coingecko.com')
        .get(/api\/v3\/simple\/supported_vs_currencies/)
        .reply(123, {
            invalid_response: 'here'
        });

    try {
        await btcValue.getSupportedCurrencies();
        t.fail();
    } catch (error) {
        t.deepEqual(error, expectedResult);
    }
});

test('server return undefined object for supported currencies', async t => {
    const expectedResult = new Error('Failed to retrieve supported currencies');

    nock.cleanAll();

    nock('https://api.coingecko.com')
        .get(/api\/v3\/simple\/supported_vs_currencies/)
        .reply(200, {});

    try {
        await btcValue.getSupportedCurrencies();
        t.fail();
    } catch (error) {
        t.deepEqual(error, expectedResult);
    }
});

test('percentage last hour return a number', async t => {
    nock.cleanAll();

    nock('https://api.coingecko.com')
        .get(/api\/v3\/coins\/markets/)
        .reply(200, [
            {
                price_change_percentage_1h_in_currency: 13.37
            }
        ]);

    try {
        const value = await btcValue.getPercentageChangeLastHour();
        t.is(typeof value, 'number');

        if (Number.isNaN(value)) {
            t.fail();
        }
    } catch (error) {
        t.is(error, '');
        t.fail();
    }
});

test('percentage last day return a number', async t => {
    nock.cleanAll();

    nock('https://api.coingecko.com')
        .get(/api\/v3\/coins\/markets/)
        .reply(200, [
            {
                price_change_percentage_24h_in_currency: 13.37
            }
        ]);

    try {
        const value = await btcValue.getPercentageChangeLastDay();

        t.is(typeof value, 'number');
        if (Number.isNaN(value)) {
            t.fail();
        }
    } catch (error) {
        t.fail();
    }
});

test('percentage last week return a number', async t => {
    nock.cleanAll();

    nock('https://api.coingecko.com')
        .get(/api\/v3\/coins\/markets/)
        .reply(200, [
            {
                price_change_percentage_7d_in_currency: 13.37
            }
        ]);

    try {
        const value = await btcValue.getPercentageChangeLastWeek();
        t.is(typeof value, 'number');

        if (Number.isNaN(value)) {
            t.fail();
        }
    } catch (error) {
        t.fail();
    }
});

test('throws if missing percent change', async t => {
    const expectedResult = new Error('Failed to retrieve percentage change');

    nock.cleanAll();

    nock('https://api.coingecko.com')
        .get(/api\/v3\/coins\/markets/)
        .reply(200, [
            {
                some_invalid: 'data'
            }
        ]);

    try {
        await btcValue.getPercentageChangeLastWeek();
        t.fail();
    } catch (error) {
        t.deepEqual(error, expectedResult);
    }
});

test('return integer when options is `currencyCode`: `USD`, `isDecimal`: `true` and `quantity`: `2.2`', async t => {
    nock('https://api.coingecko.com')
        .get(/api\/v3\/simple\/price/)
        .reply(200, {
            bitcoin: {
                usd: 56655
            }
        });

    try {
        const value = await btcValue({currencyCode: 'USD', isDecimal: false, quantity: 2.2});

        t.is(typeof value, 'number');
        t.is(value % 1, 0);
    } catch (error) {
        t.is(error, '');
        t.fail();
    }
});

test('throws when invalid is returned', async t => {
    const expectedResult = new Error('Failed to retrieve Bitcoin value');

    nock.cleanAll();

    nock('https://api.coingecko.com')
        .get(/api\/v3\/simple\/price/)
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
