import { AxiosRequestConfig } from 'axios'
import { Api } from 'axios-es6-class'
import crypto from 'crypto'
import get from 'lodash/get'
import querystring from 'querystring'

// Redis
import RedisCache from '../../utils/RedisCache'

import { LOCAL_BITCOINS_API_KEY, LOCAL_BITCOINS_API_SECRET } from '../../config'

/**
 * Api Config
 */
const apiConfig: AxiosRequestConfig = {
	timeout: 60000,
	baseURL: "https://localbitcoins.com"
}

export default class LocalBitcoinsService extends Api {

	_apiUrl: string = 'https://localbitcoins.com/api'
	_cache: RedisCache

	constructor() {
		super(apiConfig)
		this._cache = new RedisCache(8640)
	}

	/**
	 * This method returns a signature for a request as a Base64-encoded string
	 * @param  {String}  path    The relative URL path for the request
	 * @param  {Object}  request The POST body
	 * @param  {Integer} nonce   A unique, incrementing integer
	 * @return {String}          The request signature
	 */
	getMessageSignature(path: string, params: any, nonce: number): String {
		const postParameters = querystring.stringify(params)
		const message = nonce + LOCAL_BITCOINS_API_KEY + path + postParameters
		const auth_hash = crypto.createHmac("sha256", LOCAL_BITCOINS_API_SECRET).update(message).digest('hex').toUpperCase()
		return auth_hash
	}

	/**
	 * This method makes a public API request.
	 * @param  {String}   method   The API method (public or private)
	 * @param  {Object}   params   Arguments to pass to the api call
	 * @param  {String}   ad_id    A callback function to be executed when the request is complete
	 * @return {Promise<Array<any>>}            The request object
	 */
	async publicMethod(method: string, params: any = undefined, ad_id: string = '') {
		params = params || {}

		var path;
		if (ad_id !== '') {
			path = '/' + method + '/' + ad_id
		} else {
			path = '/' + method
		}

		return this.apiRequest(path, {}, params, method);
	}

	/**
	 * This method makes a private API request.
	 * @param  {String}   method   The API method (public or private)
	 * @param  {Object}   params   Arguments to pass to the api call
	 * @param  {Function} callback A callback function to be executed when the request is complete
	 * @return {Object}            The request object
	 */
	async privateMethod(method: string, params: any = null, ad_id: string = '') {
		params = params || {};

		var path;

		if (ad_id !== '') {
			path = '/' + method + '/' + ad_id;
		} else {
			path = '/' + method;
		}

		const nonce = new Date().getTime() * 1000

		var signature = this.getMessageSignature(path, params, nonce);

		var headers = {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Apiauth-Key': LOCAL_BITCOINS_API_KEY,
			'Apiauth-Nonce': LOCAL_BITCOINS_API_SECRET,
			'Apiauth-Signature': signature
		};

		return this.apiRequest(path, headers, params, method);
	}

	/**
	 * This method sends the actual HTTP request
	 * @param  {String}   uri      The URL to make the request
	 * @param  {Object}   headers  Request headers
	 * @param  {Object}   params   POST body
	 * @return {Promise<any>}      The response
	 */
	async apiRequest(uri: string, headers: any, params: any, method: string) {
		const posts = ['ad-get/ad_id', 'myself', 'ads', 'wallet-send', 'wallet-balance', 'wallet-addr']

		// Middleware before http request
		this.interceptors.request.use(param => ({
			...param,
			defaults: {
				headers,
			}
		}), (error) => {
			// handling error
			return error
		})

		try {
			const res = await posts.indexOf(method) >= 0
				? this.post(uri, params).catch(err => { throw err })
				: this.get(uri).catch(err => { throw err })

			return res
		} catch (e) {
			console.log('LocalBitcoinsService.apiRequest.error', e.message)
			return null
		}
	}

	/**
	 * Get countries
	 * 
	 * @param {boolean} refresh Refresh cache
	 */
	async getCountries(refresh: boolean = false) {
		const existsCache = await this._cache.exists('LocalBitcoins.countries')

		if (refresh || existsCache === 0) {
			const response = await this.publicMethod('api/countrycodes')

			// add cache
			await this._cache.add('LocalBitcoins.countries', get(response, 'data.data'))

			return get(response, 'data.data')
		}

		return this._cache.getValue('LocalBitcoins.countries')
	}

	/**
	 * Get Currencies
	 * 
	 * @param {boolean} refresh Refresh cache
	 */
	async getCurrencies(refresh = false) {
		const existsCache = await this._cache.exists('LocalBitcoins.currencies')

		if (refresh || existsCache === 0) {
			const response = await this.publicMethod('api/currencies')

			// add cache
			await this._cache.add('LocalBitcoins.currencies', get(response, 'data.data'))

			return get(response, 'data.data')
		}

		return this._cache.getValue('LocalBitcoins.currencies')
	}

	/**
	 * Get Currencies
	 * 
	 * @param {boolean} refresh Refresh cache
	 */
	async getBtcAvgAllCurrencies(refresh = false) {
		const existsCache = await this._cache.exists('LocalBitcoins.btcAvg')

		if (refresh || existsCache === 0) {
			const response = await this.publicMethod('bitcoinaverage/ticker-all-currencies')

			// add cache
			return this._cache.add('LocalBitcoins.btcAvg', get(response, 'data'))
		}

		return this._cache.getValue('LocalBitcoins.btcAvg')
	}

	async getBuyBitcoinsOnline(currencyCode:string, refresh:boolean = false) {
		try {
			const response = await this.publicMethod(`buy-bitcoins-online/${currencyCode}`, {}, '.json')
			
			return get(response, 'data.data') || null
		} catch (e) {
			console.log('LocalBitcoinsService.getBuyBitcoinsOnline:error', e.message)
			return null
		}
	}

	async getSellBitcoinsOnline(currencyCode:string, refresh:boolean = false) {
		try {
			const response = await this.publicMethod(`sell-bitcoins-online/${currencyCode}`, {}, '.json')
			
			return get(response, 'data.data') || null
		} catch (e) {
			console.log('LocalBitcoinsService.getSellBitcoinsOnline:error', e.message)
			return null
		}
	}

	async getAds(refresh:boolean = false) {
		try {
			const response = await this.privateMethod('api/ads')
			
			return get(response, 'data.data') || null
		} catch (e) {
			console.log('LocalBitcoinsService.apiRequest:error', e.message)
			return null
		}
	}

	// TODO:
	async getTickerAllCurrencies() {
		const response = await this.privateMethod('api/bitcoinaverage/ticker-all-currencies')

		return get(response, 'data.data') || null
	}

}