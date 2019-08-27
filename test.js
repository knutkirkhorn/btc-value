import test from 'ava';
import nock from 'nock';
import btcValue from '.';

test.after(() => {
    // Clean all nocks
    nock.cleanAll();
});

test('value return something', async t => {
    try {
        await btcValue();
        t.pass();
    } catch (error) {
        t.fail();
    }
});

test('returned value is a number #1', async t => {
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

test('returned value is non-negative number', async t => {
    try {
        const value = await btcValue();

        if (value >= 0) {
            t.pass();
        } else {
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
    const expectedResult = new TypeError('Cannot read property \'price_usd\' of undefined');

    nock('https://api.coinmarketcap.com')
        .get('/v1/ticker/bitcoin/')
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

    nock('https://api.coinmarketcap.com')
        .get('/v1/ticker/bitcoin/')
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

    nock('https://api.coinmarketcap.com')
        .get('/v1/ticker/bitcoin/')
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

    nock('https://api.coinmarketcap.com')
        .get('/v1/ticker/bitcoin/')
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

    nock('https://api.coinmarketcap.com')
        .get('/v1/ticker/bitcoin/')
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

    nock('https://api.coinmarketcap.com')
        .get('/v1/ticker/bitcoin/')
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

    nock('https://api.coinmarketcap.com')
        .get('/v1/ticker/bitcoin/')
        .reply(200, [
            {
                missing_data: 'here'
            }
        ]);

    try {
        await btcValue.getPercentageChangeLastWeek();
        t.fail();
    } catch (error) {
        t.deepEqual(error, expectedResult);
    }
});