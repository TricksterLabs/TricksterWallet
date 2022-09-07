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
  const outputs = getOutputs(sendAmount, receiveAddress, tokens)
  console.log(getInputs)

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

  const inputsData = inputs()

  console.log('inputs', inputsData)
  console.log('outputs', outputs)
  // const finalTTL = await getTTL(TTL)

  const tx = new typhonjs.Transaction({ protocolParams })

  // tx.paymentTransaction({
  //   inputs: inputsData,
  //   outputs,
  //   changeAddress: typhonjs.utils.getAddressFromBech32(sendAddress),
  //   ttl: TTL
  // })

  outputs.forEach((output) => {
    tx.addOutput(output)
  })

  tx.setTTL(TTL)

  // if (auxiliaryData) {
  //   transaction.setAuxiliaryData(auxiliaryData)
  // }

  const sendAddressMod = typhonjs.utils.getAddressFromBech32(sendAddress)
  tx.prepareTransaction({ inputs: inputsData, sendAddressMod })

  console.log(tx)

  const txHashBuffer = tx.getTransactionHash()
  const requiredSignatures = tx.getRequiredWitnesses()

  // console.log(txHashBuffer)

  // eslint-disable-next-line no-unused-vars
  for (const [, bipPath] of requiredSignatures) {
    const privateKey = paymentSKey
    const witness = {
      publicKey: privateKey.toPublicKey().toBytes(),
      signature: privateKey.sign(txHashBuffer)
    }
    tx.addWitness(witness)
  }

  // console.log(tx.inputs.amount)
  // console.log(tx.outputs)
  const txBuilt = tx.buildTransaction()
  console.log(txBuilt)
  const txHash = txBuilt.hash
  const txBuffer = Buffer.from(txBuilt.payload, 'hex')
  console.log(txHash)

  return txBuffer
}
