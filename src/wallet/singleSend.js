import { prepareWallet } from './prepareWallet.js'
import { getTTL } from './getTTL.js'
import { prepareTx } from './prepareTx.js'
// import { sendTx } from './sendTx.js'
// import BigNumber from 'bignumber.js'
import { dbData } from 'src/dexie/db'
import CryptoJS from 'crypto-js'
// import BigNumber from 'bignumber.js'
// import * as typhonjs from '@stricahq/typhonjs'

export async function singleSend (password, walletId, sendAmount, tokens, receiveAddress) {
  // await console.log(sendAmount, outputs, receiveAddress)
  // const wallet = (await dbData.wallet.where('id').equals(parseInt(Object.keys(outputs)[0])).toArray())[0]
  const wallet = (await dbData.wallet.where('id').equals(walletId).toArray())[0]
  // const lastHeight = (await dbData.history.where('id').equals(parseInt(Object.keys(outputs)[0])).toArray())[0].last_height
  // console.log(wallet)
  // console.log(lastHeight)
  const newTTL = parseInt(await getTTL() + 300)

  const decryptString = (str, salt) => {
    return JSON.parse(CryptoJS.AES.decrypt(
      str,
      salt
    ).toString(CryptoJS.enc.Utf8))
  }
  // console.log(getTTL)
  // const transformedOutputs = (outputs) => {
  //   const tokens = []
  //   for (let i = 0; i < outputs.length; i++) {
  //     tokens.push({
  //       assetName: outputs[i].asset_name,
  //       amount: new BigNumber(parseInt(outputs[i].amount)),
  //       policyId: outputs[i].policy_id
  //     })
  //   }
  //   return [
  //     {
  //       amount: new BigNumber(sendAmount * 1000000),
  //       address: typhonjs.utils.getAddressFromBech32(receiveAddress),
  //       tokens
  //     }
  //   ]
  // }
  // console.log('testttt', transformedOutputs(outputs))
  // console.log('test', outputs)
  const sendAddress = wallet.baseAddressExternal[0]
  const getInputs = wallet.utxo_set
  const walletParse = await prepareWallet(decryptString(wallet.entropy, password))
  const getOutputs = tokens
  // console.log('wallet', wallet.entropy)
  // console.log('getOutputs', getOutputs)
  // // console.log('getSendAmount', getSendAmount)
  // console.log('newTTL', newTTL)
  // console.log('getInputs', getInputs)
  // console.log('sendAddress', sendAddress)
  // console.log('receiveAddress', receiveAddress)
  // console.log('walletParse', walletParse)
  const tx = await prepareTx(sendAmount, getInputs, getOutputs, sendAddress, receiveAddress, newTTL, walletParse)
  // console.log(tx)
  return tx
}
