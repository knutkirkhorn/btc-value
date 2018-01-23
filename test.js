import test from 'ava';
import m from '.';

test('value return something', t => {
    return m().then(value => {
        t.pass();
    }).catch(() => {
        t.fail();
    });
});

test('returned value is a number #1', t => {
    return m().then(value => {
        t.is(typeof value, 'number');
    }).catch(() => {
        t.fail();
    });
});

test('returned value is a number #2', t => {
    return m.getPercentageChangeLastDay().then(value => {
        t.is(typeof value, 'number');

        if (isNaN(value)) {
            t.fail();
        }
    }).catch(() => {
        t.fail();
    });
});

test('returned value is non-negative number', t => {
    return m().then(value => {
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
    return m('string').then(value => {
        t.fail();
    }).catch(() => {
        t.pass();
    });
});

test('does throw error if parameters are wrong #2', t => {
    return m(['array', 'input']).then(value => {
        t.fail();
    }).catch(() => {
        t.pass();
    });
});

test('correct parameter test', t => {
    return m.getConvertedValue('USD').then(value => {
        t.pass();
    }).catch(() => {
        t.fail();
    });
});