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
    currency: string,
    temp_price_usd: string,
    temp_price: string,
    //TODO: complete type documentation
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