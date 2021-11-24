declare namespace btcValue {
    interface Options {
        /**
        To return the number as a decimal number.
    
        @default false
        */
        isDecimal?: boolean;
        
        /**
        To return the value of a specified quantity.
        */
        quantity?: number;
    
        /**
        To return the value of a specified currency.
    
        @default 'USD'
        */
        currencyCode?: string;
    }

    type CurrencyProvider = 'cmc' | 'coingecko'
    
    interface CMCCurrency {
        name: string,
        code: string,
        symbol: string
    }

    interface CoinGeckoCurrency {
        code: string
    }
}

declare const btcValue: {
    /**
    Get the current Bitcoin value.
    */
    (options?: btcValue.Options): Promise<number>;

    /**
    Set the selected provider to retrieve Bitcoin values from. Supported providers are: `cmc` (CoinMarketCap) and `coingecko`.

    @param provider 
     */
    setProvider(provider: btcValue.CurrencyProvider): void;

    /**
    Set the API key for the selected value provider. Currently only CoinMarketCap supports using an API key. This is required to call the functions with the [CoinMarketCap API](https://coinmarketcap.com/api/).

    @param apiKey
    */
    setApiKey(apiKey: string): void;

    /**
    Get the percentage change of BTC the last hour.
    */
    getPercentageChangeLastHour(): Promise<number>;

    /**
    Get the percentage change of BTC the last day.
    */
    getPercentageChangeLastDay(): Promise<number>;

    /**
    Get the percentage change of BTC the last week.
    */
    getPercentageChangeLastWeek(): Promise<number>;

    /**
    Get all supported currencies.

    @returns An array of all the supported currencies for the selected value provider.
    */
    getSupportedCurrencies(): Promise<btcValue.CMCCurrency[] | btcValue.CoinGeckoCurrency[]>;
}

export = btcValue;
