// import * as typhonjs from '@stricahq/typhonjs'
// import { Bip32PrivateKey } from '@stricahq/bip32ed25519'
import { entropyToMnemonic } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english'
import { Buffer } from 'buffer/'

export async function exportWallet (entropy) {
  // let strength
  // if (words === 12) {
  //   strength = 128
  // } else if (strength === 160) {
  //   strength = 160
  // } else {
  //   strength = 256
  // }
  // const genWords = await generateMnemonic(wordlist, strength)
  // console.log(genWords)
  // console.log('test', Buffer.from(entropy, 'hex'))
  const mnemonic = await entropyToMnemonic(Buffer.from(entropy, 'hex'), wordlist)
  return mnemonic
  // console.log('test', mnemonic)
}
