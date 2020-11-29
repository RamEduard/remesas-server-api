import { gql } from 'apollo-server'

export default gql`
    "Queries"
    type Query {
        "Versión del API"
        version: String
        "Api Info"
        info: ApiInfo
        "BTC Average all currencies"
        localBitcoinsAvgAllCurrencies: [LocalBitcoinsCurrencyAvg]
        "Rates by currency code"
        ratesByCurrency(
            currencyCode: String
            filters: RatesFilters
        ): RatesByCurrency
    }

    "Mutations"
    # type Mutation {

    # }

    type ApiInfo {
        author: String
        title: String
        version: String
    }

    type LocalBitcoinsRateAvg {
        last: Float
    }

    type LocalBitcoinsCurrencyAvg {
        currency: String
        volume_btc: Float
        rates: LocalBitcoinsRateAvg
        avg_6h: Float
        avg_12h: Float
        avg_24h: Float
    }

    input RatesFilters {
        paymentMethod: String
    }

    type RatesByCurrencyValues {
        avg: Float
        min: Float
        max: Float
        avg_usd: Float
        min_usd: Float
        max_usd: Float
    }

    type RatesByCurrency {
        avg: LocalBitcoinsCurrencyAvg
        buy: RatesByCurrencyValues
        sell: RatesByCurrencyValues
        spread: RatesByCurrencyValues
    }
`