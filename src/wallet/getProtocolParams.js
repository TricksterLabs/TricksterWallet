import BigNumber from 'bignumber.js'
import json from './protocol.json'
// const json = JSON.parse(fs.readFileSync('./config/protocol.json', 'utf-8'))

// const data = fetch('./protocol.json')

// const json = data.json()
// console.log(json)

const protocolParams = {
  minFeeA: new BigNumber(json.txFeePerByte),
  minFeeB: new BigNumber(json.txFeeFixed),
  stakeVKeyDeposit: new BigNumber(json.stakeAddressDeposit),
  lovelacePerUtxoWord: new BigNumber(json.utxoCostPerWord),
  collateralPercent: new BigNumber(json.collateralPercentage),
  priceMem: new BigNumber(json.executionUnitPrices.priceMemory),
  priceSteps: new BigNumber(json.executionUnitPrices.priceSteps),
  languageView: json.costModels
}

export default protocolParams
