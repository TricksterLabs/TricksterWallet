import BigNumber from 'bignumber.js'
import * as typhonjs from '@stricahq/typhonjs'

export function getOutputs (amount, address, tokens) {
  return [
    {
      amount: new BigNumber(amount * 1000000),
      address: typhonjs.utils.getAddressFromBech32(address),
      tokens
    }
  ]
}
