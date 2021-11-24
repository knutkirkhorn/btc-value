import {expectType} from 'tsd';
import btcValue = require('.');

expectType<void>(btcValue.setProvider('cmc'));
expectType<void>(btcValue.setApiKey('example-CMC-PRO-API-key'));
expectType<Promise<btcValue.CMCCurrency[] | btcValue.CoinGeckoCurrency[]>>(btcValue.getSupportedCurrencies());
expectType<Promise<number>>(btcValue());
expectType<Promise<number>>(btcValue({isDecimal: true, quantity: 13.37, currencyCode: 'NOK'}));
expectType<Promise<number>>(btcValue.getPercentageChangeLastHour());
expectType<Promise<number>>(btcValue.getPercentageChangeLastDay());
expectType<Promise<number>>(btcValue.getPercentageChangeLastWeek());
