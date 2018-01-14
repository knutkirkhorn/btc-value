import test from 'ava';
import m from '.';

test('check value return something', t => {
    return m().then(value => {
        t.pass();
    }).catch((error) => {
        t.fail();
    });
});