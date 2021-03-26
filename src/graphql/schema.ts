import { gql } from 'apollo-server'

export default gql`
    scalar Date

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
        "Transactions Get"
        transactionGet(_id: String!): Transaction
        transactionsList(filters: InputTransactionFilters): TransactionsList
        "History Rate List"
        historyRatesList(filters: InputHistoryRateFilters): HistoryRatesList
        "Hourly Rate List"
        hourlyRatesList(filters: InputHourlyRateFilters): HourlyRatesList
        "Hourly Btc Avg List"
        hourlyBtcAvgList(filters: InputHourlyBtcAvgFilters): HourlyBtcAvgList
        "Order Get"
        orderGet(_id: String!): Order
        "Order User - ID,Token"
        orderByIdAndToken(_id: String!, token: String!): OrderUser
        "Orders List"
        ordersList(filters: InputOrderFilters): OrdersList
        "Order Get"
        arbitrageTransactionGet(_id: String!): ArbitrageTransaction
        "Orders List"
        arbitrageTransactionsList(filters: InputArbitrageTransactionFilters): ArbitrageTransactionsList
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
        "Create Order"
        orderCreate(input: InputOrder!): Order
        "Create Order"
        orderDelete(_id: String): Boolean
        "Update Order"
        orderUpdate(input: InputOrder!): Order
        "Create ArbitrageTransaction"
        arbitrageTransactionCreate(input: InputArbitrageTransaction!): ArbitrageTransaction
        "Create ArbitrageTransaction"
        arbitrageTransactionDelete(_id: String): Boolean
        "Update ArbitrageTransaction"
        arbitrageTransactionUpdate(input: InputArbitrageTransaction!): ArbitrageTransaction
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
        currency: String
        paymentMethod: String
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
        orderId: String
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
        order: Order
        orderId: String
        user: User
        userId: String
        createdAt: Date
        updatedAt: Date
    }

    enum TransactionType {
        BUY
        SELL
    }

    type Comment {
        body: String
        user: User
        userId: String
        createdAt: Date
        updatedAt: Date
    }

    input InputHistoryRate {
        pair: String
        title: String
        service: String
        date: Date
        avg: Float
        buy: Float
        sell: Float
        spread: Float
        spreadPercent: Float
    }

    input InputHistoryRateFilters {
        _id: String
        date: Date
        pair: String
        service: String
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
        date: Date
        avg: Float
        buy: Float
        sell: Float
        spread: Float
        spreadPercent: Float
        createdAt: Date
        updatedAt: Date
    }

    input InputHourlyRateFilters {
        _id: String
        pair: String
        service: String
        date: Date
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
        date: Date
        avg: Float
        buy: Float
        sell: Float
        createdAt: Date
        updatedAt: Date
    }

    input InputHourlyBtcAvgFilters {
        _id: String
        currency: String
        service: String
        date: Date
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
        date: Date
        avg6h: Float
        avg12h: Float
        avg24h: Float
        last: Float
        volumeBtc: Float
        createdAt: Date
        updatedAt: Date
    }

    type OrdersList {
        hasNext: Boolean
        nextPage: Int
        items: [Order]
        pages: Int
        total: Int
    }

    type Order {
        _id: String
        token: String
        date: Date
        status: StatusType
        fromCurrency: String
        toCurrency: String
        baseRate: Float
        fromAmount: Float
        toAmount: Float
        toBankInfo: String
        spreadPercent: Float
        contactEmail: String
        contactPhone: String
        contactFullName: String
        # User Client
        userClient: User
        userClientId: String
        # User Seller
        user: User
        userId: String
        # Transactions
        transactions: [Transaction]
        transactionIds: [String]
        createdAt: Date
        updatedAt: Date
    }

    type OrderUser {
        _id: String
        date: Date
        status: StatusType
        fromCurrency: String
        toCurrency: String
        baseRate: Float
        fromAmount: Float
        toAmount: Float
        toBankInfo: String
        contactEmail: String
        contactPhone: String
        contactFullName: String
        createdAt: Date
        updatedAt: Date
    }

    enum StatusType {
        DRAFT,
        PENDING,
        WAITING_CONFIRMATION,
        CONFIRMED,
        CANCELED,
        FINISHED
    }

    input InputOrderFilters {
        _id: String
        token: String
        userId: String
        status: StatusType
    }

    input InputOrder {
        _id: String
        date: Date
        status: StatusType
        fromCurrency: String!
        toCurrency: String!
        toBankInfo: String
        spreadPercent: Float
        baseRate: Float!
        fromAmount: Float!
        toAmount: Float!
        contactEmail: String!
        contactPhone: String
        contactFullName: String!
        userClientId: String
        userId: String
    }

    type ArbitrageTransactionsList {
        hasNext: Boolean
        nextPage: Int
        items: [ArbitrageTransaction]
        pages: Int
        total: Int
    }

    type ArbitrageTransaction {
        _id: String
        direction: DirectionType
        service: String
        # Buy transaction
        buyTransactionId: String
        buyTransaction: Transaction
        # Sell transaction
        sellTransactionId: String
        sellTransaction: Transaction
        # Order
        order: Order
        orderId: String
        profitBtc: Float
        profitPercent: Float
        # User
        userId: String
        user: User
        createdAt: Date
        updatedAt: Date
    }

    enum DirectionType {
        BUY_SELL
        SELL_BUY
    }

    input InputArbitrageTransactionFilters {
        _id: String
        direction: DirectionType
        orderId: String
        userId: String
        service: String
    }

    input InputArbitrageTransaction {
        _id: String
        direction: DirectionType
        service: String
        # Buy transaction
        buyTransactionId: String
        # Sell transaction
        sellTransactionId: String
        # Order
        orderId: String
        profitBtc: Float
        profitPercent: Float
        # User
        userId: String
    }
`