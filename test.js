import test from 'ava';
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

test('returned value is a number #2', t => {
    return btcValue.getPercentageChangeLastDay().then(value => {
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

test('return decimal when options is `currencyCode`: `USD` and `isDecimal`: `true`', t => {
    return btcValue({currencyCode: 'USD', isDecimal: true}).then(value => {
        t.is(typeof value, 'number');
        t.not(value % 1, 0);
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
        t.not(value % 1, 0);
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