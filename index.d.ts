export type CurrencyProvider = 'cmc' | 'coingecko';

export type CMCCurrency = {
	name: string,
	code: string,
	symbol: string
};

/**
Get the current Bitcoin value.

@param currencyCode The currency to return the value in
@default 'USD'

@example
```
import btcValue from 'btc-value';
console.log(`$${await btcValue()}`);
// => e.g. $11048
```
*/
export default function btcValue(currencyCode?: string): Promise<number>;

/**
Set the selected provider to retrieve Bitcoin values from. Supported providers are: `cmc` (CoinMarketCap) and `coingecko`.

@param provider
*/
export function setProvider(provider: CurrencyProvider): void;

/**
Set the API key for the selected value provider. Currently only CoinMarketCap supports using an API key. This is required to call the functions with the [CoinMarketCap API](https://coinmarketcap.com/api/).

@param apiKey
*/
export function setApiKey(apiKey: string): void;

/**
Get the percentage change of BTC the last hour.
*/
export function getPercentageChangeLastHour(): Promise<number>;

/**
Get the percentage change of BTC the last day.
*/
export function getPercentageChangeLastDay(): Promise<number>;

/**
Get the percentage change of BTC the last week.
*/
export function getPercentageChangeLastWeek(): Promise<number>;

/**
Get all supported currencies.

@returns An array of all the supported currencies for the selected value provider.
*/
export function getSupportedCurrencies(): Promise<CMCCurrency[] | string[]>;
