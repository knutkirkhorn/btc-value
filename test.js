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

test('does throw error if parameters are wrong #1', t => {
    return btcValue('string').then(() => {
        t.fail();
    }).catch(() => {
        t.pass();
    });
});

test('does throw error if parameters are wrong #2', t => {
    return btcValue(['array', 'input']).then(() => {
        t.fail();
    }).catch(() => {
        t.pass();
    });
});

test('correct parameter test', t => {
    return btcValue.getConvertedValue('USD').then(() => {
        t.pass();
    }).catch(() => {
        t.fail();
    });
});