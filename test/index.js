// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import btcValue, {setProvider, setApiKey} from '../index.js';

test('set invalid provider throws error', t => {
	const expectedResult = new Error('`provider` needs to be one of `cmc` and `coingecko`');

	try {
		setProvider('knuts-api');
	} catch (error) {
		t.deepEqual(error, expectedResult);
	}
});

test('throws error if the provided API key is empty', t => {
	const expectedResult = new Error('You need to provide an API key.');

	try {
		setApiKey('');
	} catch (error) {
		t.deepEqual(error, expectedResult);
	}
});

test('throws TypeError when `apiKey` is not a string', t => {
	const expectedResult = new TypeError('`apiKey` should be of type `string`');

	try {
		setApiKey(1337);
	} catch (error) {
		t.deepEqual(error, expectedResult);
	}
});

test('throws TypeError when `isDecimal` is not a boolean', async t => {
	const expectedResult = new TypeError('`isDecimal` should be of type `boolean`');

	try {
		await btcValue({isDecimal: 'true'});
		t.fail();
	} catch (error) {
		t.deepEqual(error, expectedResult);
	}
});

test('throws TypeError when `quantity` is not a number', async t => {
	const expectedResult = new TypeError('`quantity` should be of type `number`');

	try {
		await btcValue({quantity: '1337'});
		t.fail();
	} catch (error) {
		t.deepEqual(error, expectedResult);
	}
});

test('throws TypeError when `currencyCode` is not a string', async t => {
	const expectedResult = new TypeError('`currencyCode` should be of type `string`');

	try {
		await btcValue({currencyCode: 1337});
		t.fail();
	} catch (error) {
		t.deepEqual(error, expectedResult);
	}
});
