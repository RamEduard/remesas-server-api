import { localBitcoinsService } from './services'

const PATH = '/buy-bitcoins-online/ARS/.json'
const NONCE = new Date().getTime() * 1000

console.log(
    localBitcoinsService.getMessageSignature(PATH, {}, NONCE)
)