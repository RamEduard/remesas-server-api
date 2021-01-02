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
        "User authenticated info"
        userInfo: User
        "Dashboard"
        dashboard: DashboardResponse
        "Buy on LocalBitboins by currency code"
        localBitcoinsBuy(
            currencyCode: String!
            filters: RatesFilters
        ): LocalBitcoinsAdResponse
        "Sell on LocalBitboins by currency code"
        localBitcoinsSell(
            currencyCode: String!
            filters: RatesFilters
        ): LocalBitcoinsAdResponse
        "Transactions List"
        transactionsList(filters: InputTransactionFilters): TransactionsList
        "History Rate List"
        historyRatesList(filters: InputHistoryRateFilters): HistoryRatesList
        "Hourly Rate List"
        hourlyRatesList(filters: InputHourlyRateFilters): HourlyRatesList
        "Hourly Btc Avg List"
        hourlyBtcAvgList(filters: InputHourlyBtcAvgFilters): HourlyBtcAvgList
    }

    "Mutations"
    type Mutation {
        "Auth Login"
        signin(email: String!, password: String!): JwtToken
        "Auth Register"
        signup(user: InputUser): SignUpResponse
        "Create Transaction"
        transactionCreate(input: InputTransaction!): Transaction
        "Create Transaction"
        transactionDelete(_id: String): Boolean
        "Update Transaction"
        transactionUpdate(input: InputTransaction!): Transaction
        "Create InputHistoryRate"
        historyRateCreate(input: InputHistoryRate!): HistoryRate
        "Create InputHistoryRate"
        historyRateDelete(_id: String): Boolean
        "Update InputHistoryRate"
        historyRateUpdate(input: InputHistoryRate!): HistoryRate
    }

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
        first: Float
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

    type JwtToken {
        token: String
        expirationDate: String
    }

    input InputUser {
        firstName: String!
        lastName: String!
        email: String!
        password: String!
    }

    type User {
        firstName: String
        lastName: String
        email: String
    }

    type SignUpResponse {
        saved: Boolean
        message: String
    }

    type ExchangeRate {
        label: String
        pair: String
        rate: Float
    }

    type DashboardResponse {
        btcRates: [ExchangeRate]
    }

    type LocalBitcoinsAd {
        ad_id: String,
        profile: LocalBitcoinsProfile
        visible: Boolean
        hidden_by_opening_hours: Boolean
        location_string: String
        countrycode: String
        city: String
        trade_type: String
        online_provider: String
        first_time_limit_btc: String
        volume_coefficient_btc: String
        sms_verification_required: String
        currency: String
        lat: Float
        lon: Float
        min_amount: Float
        max_amount: Float
        max_amount_available: Float
        temp_price_usd: Float
        temp_price: Float
        created_at: String
        require_feedback_score: Float
        require_trade_volume: Float
        msg: String
        bank_name: String
        atm_model: String
        require_trusted_by_advertiser: Boolean
        require_identification: Boolean
        is_local_office: Boolean
        payment_window_minutes: Float
        limit_to_fiat_amounts: String
    }

    type LocalBitcoinsProfile {
        username: String
        trade_count: String
        feedback_score: Float
        name: String
        last_online: String
    }

    type LocalBitcoinsAction {
        public_view: String
    }

    type LocalBitcoinsListAd {
        data: LocalBitcoinsAd,
        actions: LocalBitcoinsAction
    }

    type LocalBitcoinsAdResponse {
        ad_list: [LocalBitcoinsListAd],
        ad_count: Int
    }

    input InputTransactionFilters {
        _id: String
    }

    input InputTransaction {
        "To update is required"
        _id: String
        type: TransactionType
        rate: Float
        currency: String
        currencyLabel: String
        amountBtc: Float
        amountCurrency: Float
        paymentMethod: String
        paymentMethodDescription: String
        images: [String]
        userId: String
    }

    type TransactionsList {
        hasNext: Boolean
        nextPage: Int
        items: [Transaction]
        pages: Int
        total: Int
    }

    type Transaction {
        _id: String
        type: TransactionType
        rate: Float
        currency: String
        currencyLabel: String
        amountBtc: Float
        amountCurrency: Float
        paymentMethod: String
        paymentMethodDescription: String
        images: [String]
        comments: [Comment]
        user: User
        userId: String
        createdAt: String
        updatedAt: String
    }

    enum TransactionType {
        BUY
        SELL
    }

    type Comment {
        body: String
        user: User
        userId: String
        createdAt: String
        updatedAt: String
    }

    input InputHistoryRate {
        pair: String
        title: String
        service: String
        date: String
        avg: Float
        buy: Float
        sell: Float
        spread: Float
        spreadPercent: Float
    }

    input InputHistoryRateFilters {
        _id: String
    }

    type HistoryRatesList {
        hasNext: Boolean
        nextPage: Int
        items: [HistoryRate]
        pages: Int
        total: Int
    }

    type HistoryRate {
        _id: String
        pair: String
        title: String
        service: String
        date: String
        avg: Float
        buy: Float
        sell: Float
        spread: Float
        spreadPercent: Float
        createdAt: String
        updatedAt: String
    }

    input InputHourlyRateFilters {
        _id: String
        pair: String
        service: String
        date: String
    }

    type HourlyRatesList {
        hasNext: Boolean
        nextPage: Int
        items: [HourlyRate]
        pages: Int
        total: Int
    }

    type HourlyRate {
        _id: String
        pair: String
        service: String
        date: String
        avg: Float
        buy: Float
        sell: Float
        createdAt: String
        updatedAt: String
    }

    input InputHourlyBtcAvgFilters {
        _id: String
        currency: String
        service: String
        date: String
    }

    type HourlyBtcAvgList {
        hasNext: Boolean
        nextPage: Int
        items: [HourlyBtcAvg]
        pages: Int
        total: Int
    }

    type HourlyBtcAvg {
        _id: String
        currency: String
        service: String
        date: String
        avg6h: Float
        avg12h: Float
        avg24h: Float
        last: Float
        volumeBtc: Float
        createdAt: String
        updatedAt: String
    }
`