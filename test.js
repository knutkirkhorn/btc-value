import test from 'ava';
import nock from 'nock';
import btcValue from '.';

test.before(async t => {
    const expectedResult = new Error('`apiKey` needs to be set. Call `.setApiKey()` with your API key before calling other functions.');

    // Check that the function can not be called without an API key
    // This will throw an error
    try {
        await btcValue();
        t.fail();
    } catch (error) {
        t.deepEqual(error, expectedResult);
    }

    // Set an example API key for all remaining tests
    btcValue.setApiKey('example-CMC-PRO-API-key');
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
                error_message: null
            },
            data: {
                BTC: {
                    quote: {
                        USD: {
                            price: 8983.34736401,
                            percent_change_1h: -1.67074,
                            percent_change_24h: -1.0296,
                            percent_change_7d: 3.72573
                        },
                        NOK: {
                            price: 83110.91835295832,
                            percent_change_1h: -1.73148,
                            percent_change_24h: -1.05610461,
                            percent_change_7d: 2.12793914
                        }
                    }
                }
            }
        });
});

test('throws error if no API key is provided to `.setApiKey()`', t => {
    const expectedResult = new Error('You need to provide an API key.');

    try {
        btcValue.setApiKey('');
    } catch (error) {
        t.deepEqual(error, expectedResult);
    }
});

test('throws TypeError when `apiKey` is not a string', t => {
    const expectedResult = new TypeError('`apiKey` should be of type `string`');

    try {
        btcValue.setApiKey(1337);
    } catch (error) {
        t.deepEqual(error, expectedResult);
    }
});

test('returned value is a number', async t => {
    try {
        const value = await btcValue();
        t.is(typeof value, 'number');
    } catch (error) {
        t.fail();
    }
});

test('percentage last hour return a number', async t => {
    try {
        const value = await btcValue.getPercentageChangeLastHour();
        t.is(typeof value, 'number');

        if (Number.isNaN(value)) {
            t.fail();
        }
    } catch (error) {
        t.fail();
    }
});

test('percentage last day return a number', async t => {
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

test('return integer when options is `currencyCode`: `USD`', async t => {
    try {
        const value = await btcValue({currencyCode: 'USD'});

        t.is(typeof value, 'number');
        t.is(value % 1, 0);
    } catch (error) {
        t.fail();
    }
});

test('return integer when `currencyCode` is `NOK`', async t => {
    try {
        const value = await btcValue({currencyCode: 'NOK'});

        t.is(typeof value, 'number');
        t.is(value % 1, 0);
    } catch (error) {
        t.fail();
    }
});

test('return decimal when options is `currencyCode`: `USD` and `isDecimal`: `true`', async t => {
    try {
        const value = await btcValue({currencyCode: 'USD', isDecimal: true});

        t.is(typeof value, 'number');
    } catch (error) {
        t.fail();
    }
});

test('return integer when options is `currencyCode`: `USD`, `isDecimal`: `true` and `quantity`: `2.2`', async t => {
    try {
        const value = await btcValue({currencyCode: 'USD', isDecimal: false, quantity: 2.2});

        t.is(typeof value, 'number');
        t.is(value % 1, 0);
    } catch (error) {
        t.fail();
    }
});

test('return integer when `isDecimal` is false', async t => {
    try {
        const value = await btcValue({isDecimal: false});

        t.is(typeof value, 'number');
        t.is(value % 1, 0);
    } catch (error) {
        t.fail();
    }
});

test('return decimal when `isDecimal` is true', async t => {
    try {
        const value = await btcValue({isDecimal: true});

        t.is(typeof value, 'number');
    } catch (error) {
        t.fail();
    }
});

test('return integer when `isDecimal` is not in options', async t => {
    try {
        const value = await btcValue({isDecimalsss: true});

        t.is(typeof value, 'number');
        t.is(value % 1, 0);
    } catch (error) {
        t.is(error, '');
        t.fail();
    }
});

test('return TypeError when `isDecimal` is not a boolean', async t => {
    const expectedResult = new TypeError('`isDecimal` should be of type `boolean`');

    try {
        await btcValue({isDecimal: 'true'});
        t.fail();
    } catch (error) {
        t.deepEqual(error, expectedResult);
    }
});

test('return TypeError when `quantity` is not a number', async t => {
    const expectedResult = new TypeError('`quantity` should be of type `number`');

    try {
        await btcValue({quantity: '1337'});
        t.fail();
    } catch (error) {
        t.deepEqual(error, expectedResult);
    }
});

test('return TypeError when `currencyCode` is not a string', async t => {
    const expectedResult = new TypeError('`currencyCode` should be of type `string`');

    try {
        await btcValue({currencyCode: 1337});
        t.fail();
    } catch (error) {
        t.deepEqual(error, expectedResult);
    }
});

test('return Error when `currencyCode` is not a valid one', async t => {
    const expectedResult = new Error('Please choose a valid `currencyCode`');

    try {
        await btcValue({currencyCode: 'KNUT'});
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
    const expectedResult = new Error('Failed to load url: 123');

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
    const expectedResult = new Error('Failed to load url: 1337');

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
    const expectedResult = {
        errno: 'ECONNREFUSED',
        code: 'ECONNREFUSED',
        syscall: 'connect'
    };

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
        await btcValue.getPercentageChangeLastWeek();
        t.fail();
    } catch (error) {
        t.deepEqual(error, expectedResult);
    }
});

test('throws error if API key is invalid', async t => {
    const expectedResult = new Error('Error occurred while retrieving Bitcoin value: This API Key is invalid.');

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