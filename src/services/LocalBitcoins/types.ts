/**
 * Ads Response
 */
export interface LocalBitcoinsAdResponse {
    ad_list: LocalBitcoinsListAd[],
    ad_count: number
}

/**
 * Avg Response
 */
export interface LocalBitcoinsAvgResponse {
    [key: string]: LocalBitcoinsCurrencyAvg
}

export interface LocalBitcoinsAction {
    public_view: string
}

export interface LocalBitcoinsListAd {
    data: LocalBitcoinsAd,
    actions: LocalBitcoinsAction
}

export interface LocalBitcoinsAd {
    ad_id: string,
    profile: LocalBitcoinsProfile,
    visible: boolean,
    hidden_by_opening_hours: boolean,
    location_string: string,
    countrycode: string,
    city: string,
    trade_type: string,
    online_provider: string,
    first_time_limit_btc: string,
    volume_coefficient_btc: string,
    sms_verification_required: string,
    currency: string,
    lat: number,
    lon: number,
    min_amount: string,
    max_amount: string,
    max_amount_available: string,
    temp_price_usd: string,
    temp_price: string,
    created_at: string,
    require_feedback_score: number,
    require_trade_volume: number,
    msg: string,
    bank_name: string,
    atm_model: string,
    require_trusted_by_advertiser: boolean,
    require_identification: boolean,
    is_local_office: boolean,
    payment_window_minutes: number,
    limit_to_fiat_amounts: string
}

export interface LocalBitcoinsProfile {
    username: string,
    trade_count: string,
    feedback_score: number,
    name: string,
    last_online: string
}

export interface LocalBitcoinsCurrencyAvg {
    volume_btc: string,
    rates: LocalBitcoinsRateAvg,
    avg_1h: string,
    avg_6h: string,
    avg_12h: string,
    avg_24h: string
}

export interface LocalBitcoinsRateAvg {
    last: string
}