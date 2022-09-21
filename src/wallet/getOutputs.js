import BigNumber from 'bignumber.js'
import * as typhonjs from '@stricahq/typhonjs'

export function getOutputs (amount, address, tokens) {
  const tokensArray = []
  for (let i = 0; i < tokens.length; i++) {
    tokensArray.push({
      assetName: tokens[i].asset_name,
      amount: new BigNumber(parseInt(tokens[i].amount)),
      policyId: tokens[i].policy_id
    })
  }
  return [
    {
      amount: new BigNumber(amount * 1000000),
      address: typhonjs.utils.getAddressFromBech32(address),
      tokens: tokensArray
    }
  ]
}
