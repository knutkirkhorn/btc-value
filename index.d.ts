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
    
    interface Currency {
        name: string,
        code: string,
        symbol: string
    }
}

declare const btcValue: {
    /**
    Get the current Bitcoin value.
    */
    (options?: btcValue.Options): Promise<number>;

    /**
    Set the API key to the the [Cryptocurrency Market Capitalizations API](https://coinmarketcap.com/api/).

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

    @returns Supported currency objects.
    */
    currencies: btcValue.Currency[];
}

export = btcValue;
