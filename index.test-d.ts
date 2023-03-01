import {expectType} from 'tsd';
import btcValue, {
	CMCCurrency,
	getPercentageChangeLastDay,
	getPercentageChangeLastHour,
	getPercentageChangeLastWeek,
	getSupportedCurrencies,
	setApiKey,
	setProvider
} from './index.js';

expectType<void>(setProvider('cmc'));
expectType<void>(setApiKey('example-CMC-PRO-API-key'));
expectType<Promise<CMCCurrency[] | string[]>>(getSupportedCurrencies());
expectType<Promise<number>>(btcValue());
expectType<Promise<number>>(btcValue({isDecimal: true, quantity: 13.37, currencyCode: 'NOK'}));
expectType<Promise<number>>(getPercentageChangeLastHour());
expectType<Promise<number>>(getPercentageChangeLastDay());
expectType<Promise<number>>(getPercentageChangeLastWeek());
