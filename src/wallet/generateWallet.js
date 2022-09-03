import * as typhonjs from '@stricahq/typhonjs'
import { Bip32PrivateKey } from '@stricahq/bip32ed25519'
import { generateMnemonic, mnemonicToEntropy } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english'
import { Buffer } from 'buffer/'

export async function generateWallet (words) {
  let strength
  if (words === 12) {
    strength = 128
  } else if (strength === 160) {
    strength = 160
  } else {
    strength = 256
  }
  const genWords = await generateMnemonic(wordlist, strength)
  console.log(genWords)
  const entropy = Buffer.from((await mnemonicToEntropy(genWords, wordlist)).buffer).toString('hex')
  console.log(entropy)

  // Buffer.from(entropy.buffer).toString('hex')

  const rootKey = await Bip32PrivateKey.fromEntropy(Buffer.from(entropy, 'hex'))
  console.log(rootKey)

  const HARDENED = 2147483648

  const accountKey = rootKey
    .derive(HARDENED + 1852) // purpose
    .derive(HARDENED + 1815) // coin type
    .derive(HARDENED + 0) // account index

  const paymentSKey = accountKey
    .derive(0)
    .derive(0)
    .toPrivateKey()

  const paymentSKey1 = accountKey
    .derive(1)
    .derive(0)
    .toPrivateKey()

  const paymentVKey = paymentSKey
    .toPublicKey()
    .hash()
    .toString('hex')

  const paymentVKey1 = paymentSKey1
    .toPublicKey()
    .hash()
    .toString('hex')

  const stakeSKey = accountKey
    .derive(2)
    .derive(0)
    .toPrivateKey()

  const stakeVKey = stakeSKey
    .toPublicKey()
    .hash()
    .toString('hex')

  const paymentCred0 = {
    hash: paymentVKey,
    type: typhonjs.types.HashType.ADDRESS,
    bipPath: {
      purpose: 1852 + HARDENED,
      coin: 1815 + HARDENED,
      account: 0 + HARDENED,
      chain: 0,
      index: 0
    }
  }

  const paymentCred1 = {
    hash: paymentVKey1,
    type: typhonjs.types.HashType.ADDRESS,
    bipPath: {
      purpose: 1852 + HARDENED,
      coin: 1815 + HARDENED,
      account: 0 + HARDENED,
      chain: 1,
      index: 0
    }
  }

  const stakeCredential = {
    hash: stakeVKey,
    type: typhonjs.types.HashType.ADDRESS,
    bipPath: {
      purpose: 1852 + HARDENED,
      coin: 1815 + HARDENED,
      account: 0 + HARDENED,
      chain: 2,
      index: 0
    }
  }

  const stakeAddressHex = new typhonjs.address.RewardAddress(typhonjs.types.NetworkId.MAINNET, stakeCredential)
  const enterpriseAddressExternalHex = new typhonjs.address.EnterpriseAddress(typhonjs.types.NetworkId.MAINNET, paymentCred0)
  const enterpriseAddressInternalHex = new typhonjs.address.EnterpriseAddress(typhonjs.types.NetworkId.MAINNET, paymentCred1)
  const baseAddressExternalHex = new typhonjs.address.BaseAddress(typhonjs.types.NetworkId.MAINNET, paymentCred0, stakeCredential)
  const baseAddressInternalHex = new typhonjs.address.BaseAddress(typhonjs.types.NetworkId.MAINNET, paymentCred1, stakeCredential)

  const stakeAddress = await stakeAddressHex.getBech32()
  const enterpriseAddressExternal = await enterpriseAddressExternalHex.getBech32()
  const enterpriseAddressInternal = await enterpriseAddressInternalHex.getBech32()
  const baseAddressExternal = await baseAddressExternalHex.getBech32()
  const baseAddressInternal = await baseAddressInternalHex.getBech32()

  return { entropy, stakeAddress, enterpriseAddressExternal, enterpriseAddressInternal, baseAddressExternal, baseAddressInternal }
}
