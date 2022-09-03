// import cardanoUtil from '@stricahq/typhonjs'
import { Bip32PrivateKey } from '@stricahq/bip32ed25519'
// import { generateMnemonic, mnemonicToEntropy } from 'bip39'
import { Buffer } from 'buffer/index'

export async function prepareWallet (entropy) {
  const rootKey = await Bip32PrivateKey.fromEntropy(Buffer.from(entropy, 'hex'))

  const HARDENED = 2147483648

  const accountKey = rootKey
    .derive(HARDENED + 1852) // purpose
    .derive(HARDENED + 1815) // coin type
    .derive(HARDENED + 0) // account index

  const paymentSKey = accountKey
    .derive(0)
    .derive(0)
    .toPrivateKey()

  return paymentSKey
}
