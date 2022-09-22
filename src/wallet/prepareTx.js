import * as typhonjs from '@stricahq/typhonjs'
import protocolParams from './getProtocolParams.js'
import BigNumber from 'bignumber.js'
import { Buffer } from 'buffer/'

// import { getInputs } from './getInputs.js'
import { getOutputs } from './getOutputs.js'
// import { getTTL } from './getTTL.js'

export async function prepareTx (sendAmount, getInputs, tokens, sendAddress, receiveAddress, TTL, paymentSKey) {
  // const inputs = await getInputs(sendAddress)
  // if (inputs.length === 0) {
  //   return
  // }

  console.log('sendAmount', sendAmount)
  console.log('getInputs', getInputs)
  console.log('tokens', tokens)
  console.log('sendAddress', sendAddress)
  console.log('receiveAddress', receiveAddress)
  console.log('TTL', TTL)
  console.log('paymentSKey', paymentSKey)

  const outputs = getOutputs(sendAmount, receiveAddress, tokens)
  console.log('outputs', outputs)
  // console.log(getInputs)
  // console.log(getInputs)

  const assets = (tokens) => {
    const assetData = []
    for (let i = 0; i < tokens.length; i++) {
      const objectData = {
        assetName: tokens[i].asset_name,
        policyId: tokens[i].policy_id,
        amount: new BigNumber(parseInt(tokens[i].quantity))
      }
      assetData.push(objectData)
    }
    return assetData
  }

  const inputs = () => {
    const inputsData = []
    for (let i = 0; i < getInputs.length; i++) {
      const objectData = {
        txId: getInputs[i].tx_hash,
        index: getInputs[i].tx_index,
        amount: new BigNumber(parseInt(getInputs[i].value)),
        tokens: assets(getInputs[i].asset_list),
        address: typhonjs.utils.getAddressFromBech32(sendAddress)
      }
      inputsData.push(objectData)
    }
    return inputsData
  }

  console.log('inputs', inputs())

  const inputsData = inputs()

  const tx = new typhonjs.Transaction({ protocolParams })

  outputs.forEach((output) => {
    tx.addOutput(output)
  })

  tx.setTTL(TTL)

  console.log('getFee', tx.getFee())
  const sendAddressMod = typhonjs.utils.getAddressFromBech32(sendAddress)
  console.log('yoyo', tx.calculateMinUtxoAmount().toNumber())
  tx.prepareTransaction({ inputs: inputsData, changeAddress: sendAddressMod })

  const txHashBuffer = tx.getTransactionHash()
  const requiredSignatures = tx.getRequiredWitnesses()
  // eslint-disable-next-line no-unused-vars
  for (const [, bipPath] of requiredSignatures) {
    const privateKey = paymentSKey
    const witness = {
      publicKey: privateKey.toPublicKey().toBytes(),
      signature: privateKey.sign(txHashBuffer)
    }
    tx.addWitness(witness)
  }
  const fee = tx.fee
  // console.log('omega', fee.toNumber())
  // console.log('HUAIA', tx.getInputs()[1].tokens)
  const minUtxo = typhonjs.utils.calculateMinUtxoAmount(tx.getInputs(), protocolParams.lovelacePerUtxoWord)
  // console.log('MEGA', tx.getOutputs())
  const txBuilt = tx.buildTransaction()
  // console.log('yoyo', tx.calculateMinUtxoAmount().toNumber())
  // const txHash = txBuilt.hash
  const txBuffer = Buffer.from(txBuilt.payload, 'hex')

  return { txBuffer, minUtxo, fee }
}
