import test from 'ava';
import nock from 'nock';
import btcValue from '.';

test('value return something', t => {
    return btcValue().then(() => {
        t.pass();
    }).catch(() => {
        t.fail();
    });
});

test('returned value is a number #1', t => {
    return btcValue().then(value => {
        t.is(typeof value, 'number');
    }).catch(() => {
        t.fail();
    });
});

test('percentage last hour return a number', t => {
    return btcValue.getPercentageChangeLastHour().then(value => {
        t.is(typeof value, 'number');

        if (isNaN(value)) {
            t.fail();
        }
    }).catch(() => {
        t.fail();
    });
});

test('percentage last day return a number', t => {
    return btcValue.getPercentageChangeLastDay().then(value => {
        t.is(typeof value, 'number');

        if (isNaN(value)) {
            t.fail();
        }
    }).catch(() => {
        t.fail();
    });
});

test('percentage last week return a number', t => {
    return btcValue.getPercentageChangeLastWeek().then(value => {
        t.is(typeof value, 'number');

        if (isNaN(value)) {
            t.fail();
        }
    }).catch(() => {
        t.fail();
    });
});

test('returned value is non-negative number', t => {
    return btcValue().then(value => {
        if (value >= 0) {
            t.pass();
        } else {
            t.fail();
        }
    }).catch(() => {
        t.fail();
    });
});

test('return integer when options is `currencyCode`: `USD`', t => {
    return btcValue({currencyCode: 'USD'}).then(value => {
        t.is(typeof value, 'number');
        t.is(value % 1, 0);
    }).catch(() => {
        t.fail();
    });
});

test('return integer when `currencyCode` is `NOK`', t => {
    return btcValue({currencyCode: 'NOK'}).then(value => {
        t.is(typeof value, 'number');
        t.is(value % 1, 0);
    }).catch(() => {
        t.fail();
    });
});

test('return decimal when options is `currencyCode`: `USD` and `isDecimal`: `true`', t => {
    return btcValue({currencyCode: 'USD', isDecimal: true}).then(value => {
        t.is(typeof value, 'number');
    }).catch(() => {
        t.fail();
    });
});

test('return integer when options is `currencyCode`: `USD`, `isDecimal`: `true` and `quantity`: `2.2`', t => {
    return btcValue({currencyCode: 'USD', isDecimal: false, quantity: 2.2}).then(value => {
        t.is(typeof value, 'number');
        t.is(value % 1, 0);
    }).catch(() => {
        t.fail();
    });
});

test('return integer when `isDecimal` is false', t => {
    return btcValue({isDecimal: false}).then(value => {
        t.is(typeof value, 'number');
        t.is(value % 1, 0);
    }).catch(() => {
        t.fail();
    });
});

test('return decimal when `isDecimal` is true', t => {
    return btcValue({isDecimal: true}).then(value => {
        t.is(typeof value, 'number');
    }).catch(() => {
        t.fail();
    });
});

test('return integer when `isDecimal` is not in options', t => {
    return btcValue({isDecimalsss: true}).then(value => {
        t.is(typeof value, 'number');
        t.is(value % 1, 0);
    }).catch(() => {
        t.fail();
    });
});

test('return TypeError when `isDecimal` is not a boolean', t => {
    const expectedResult = TypeError('`isDecimal` should be of type `boolean`');

    return btcValue({isDecimal: 'true'}).then(() => {
        t.fail();
    }).catch(error => {
        t.deepEqual(error, expectedResult);
    });
});

test('return TypeError when `quantity` is not a number', t => {
    const expectedResult = TypeError('`quantity` should be of type `number`');

    return btcValue({quantity: '1337'}).then(() => {
        t.fail();
    }).catch(error => {
        t.deepEqual(error, expectedResult);
    });
});

test('return TypeError when `currencyCode` is not a string', t => {
    const expectedResult = TypeError('`currencyCode` should be of type `string`');

    return btcValue({currencyCode: 1337}).then(() => {
        t.fail();
    }).catch(error => {
        t.deepEqual(error, expectedResult);
    });
});

test('return Error when `currencyCode` is not a valid one', t => {
    const expectedResult = Error('Please choose a valid `currencyCode`');

    return btcValue({currencyCode: 'KNUT'}).then(() => {
        t.fail();
    }).catch(error => {
        t.deepEqual(error, expectedResult);
    });
});

test('server return invalid data response', t => {
    const expectedResult = TypeError('Cannot read property \'price_usd\' of undefined');

    nock('https://api.coinmarketcap.com')
        .get('/v1/ticker/bitcoin/')
        .reply(200, {
            invalid_response: 'here'
        });

    return btcValue().then(() => {
        t.fail();
    }).catch(error => {
        t.deepEqual(error, expectedResult);
    });
});

test('server return non-JSON response', t => {
    const expectedResult = Error('Failed to retrieve Bitcoin value');

    nock('https://api.coinmarketcap.com')
        .get('/v1/ticker/bitcoin/')
        .reply(200, 'no_json here');

    return btcValue().then(() => {
        t.fail();
    }).catch(error => {
        t.deepEqual(error, expectedResult);
    });
});

test('server return invalid HTTP status code (123)', t => {
    const expectedResult = Error('Failed to load url: 123');

    nock('https://api.coinmarketcap.com')
        .get('/v1/ticker/bitcoin/')
        .reply(123, {
            invalid_response: 'here'
        });

    return btcValue().then(() => {
        t.fail();
    }).catch(error => {
        t.deepEqual(error, expectedResult);
    });
});

test('server return invalid HTTP status code (1337)', t => {
    const expectedResult = Error('Failed to load url: 1337');

    nock('https://api.coinmarketcap.com')
        .get('/v1/ticker/bitcoin/')
        .reply(1337, {
            invalid_response: 'here'
        });

    return btcValue().then(() => {
        t.fail();
    }).catch(error => {
        t.deepEqual(error, expectedResult);
    });
});

test('server return error code', t => {
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

    return btcValue().then(() => {
        t.fail();
    }).catch(error => {
        t.deepEqual(error, expectedResult);
    });
});

test('server return missing data (missing `price_usd`)', t => {
    const expectedResult = Error('Failed to retrieve Bitcoin value');

    nock('https://api.coinmarketcap.com')
        .get('/v1/ticker/bitcoin/')
        .reply(200, [
            {
                missing_data: 'here'
            }
        ]);

    return btcValue().then(() => {
        t.fail();
    }).catch(error => {
        t.deepEqual(error, expectedResult);
    });
});

test('server return missing data (missing percent change)', t => {
    const expectedResult = Error('Failed to retrieve percentage change');

    nock('https://api.coinmarketcap.com')
        .get('/v1/ticker/bitcoin/')
        .reply(200, [
            {
                missing_data: 'here'
            }
        ]);

    return btcValue.getPercentageChangeLastWeek().then(() => {
        t.fail();
    }).catch(error => {
        t.deepEqual(error, expectedResult);
    });
});

test.after(() => {
    // Clean all nocks
    nock.cleanAll();
});