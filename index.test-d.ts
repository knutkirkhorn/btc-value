import {expectType} from 'tsd';
import btcValue = require('.');

expectType<void>(btcValue.setApiKey('example-CMC-PRO-API-key'));
expectType<btcValue.Currency[]>(btcValue.currencies);
expectType<Promise<number>>(btcValue());
expectType<Promise<number>>(btcValue({isDecimal: true, quantity: 13.37, currencyCode: 'NOK'}));
expectType<Promise<number>>(btcValue.getPercentageChangeLastHour());
expectType<Promise<number>>(btcValue.getPercentageChangeLastDay());
expectType<Promise<number>>(btcValue.getPercentageChangeLastWeek());
