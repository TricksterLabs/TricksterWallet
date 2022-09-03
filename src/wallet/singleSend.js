import { prepareWallet } from './prepareWallet.js'
import { getTTL } from './getTTL.js'
import { prepareTx } from './prepareTx.js'
import { sendTx } from './sendTx.js'
// import BigNumber from 'bignumber.js'
import { dbData } from 'src/dexie/db'

export async function singleSend (sendAmount, outputs, receiveAddress) {
  // await console.log(sendAmount, outputs, receiveAddress)
  const wallet = (await dbData.wallet.where('id').equals(parseInt(Object.keys(outputs)[0])).toArray())[0]
  // const lastHeight = (await dbData.history.where('id').equals(parseInt(Object.keys(outputs)[0])).toArray())[0].last_height
  // console.log(wallet)
  // console.log(lastHeight)
  const newTTL = parseInt(await getTTL() + 300)
  // console.log(getTTL)
  const sendAddress = wallet.baseAddressExternal[0]
  const getInputs = wallet.utxo_set
  const walletParse = await prepareWallet(wallet.entropy)
  const getOutputs = Object.values(outputs)[0]
  // console.log('wallet', wallet.entropy)
  // console.log('getOutputs', getOutputs)
  // console.log('getSendAmount', getSendAmount)
  // console.log('getTTL', getTTL)
  // console.log('getInputs', getInputs)
  // console.log('sendAddress', sendAddress)
  // console.log('receiveAddress', receiveAddress)
  // console.log('walletParse', walletParse)
  const tx = await prepareTx(sendAmount, getInputs, getOutputs, sendAddress, receiveAddress, newTTL, walletParse)
  console.log(tx)
  await sendTx(tx)
}
