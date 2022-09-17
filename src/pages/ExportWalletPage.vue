<template>
  <q-page
    class="q-pa-sm text-weight-bolder"
  >
    <q-card>
      <q-card-section>
        <div class="text-h6 text-center">
          Export Wallets
        </div>
      </q-card-section>
      <q-card-actions
        align="center"
        class="q-mr-lg q-pb-md"
      >
        <q-input
          v-model="password"
          outlined
          dense
          type="password"
          label="Password" class="q-mr-md"
        />
        <q-btn
          label="Generate"
          color="positive"
          outline
          @click="showAll"
          :disable="!password"
        />
      </q-card-actions>
      <q-card-section class="col-12 items-center">
        <q-item class="full-width">
          <q-item-section>
            <q-input
              dense
              disable
              autogrow
              class="textarea"
              v-model.number="amountOfWallet"
              input-class=""
              label="Wallet private keys, one per line"
              outlined
            />
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { dbData, getFromDb } from '../dexie/db'
// import { liveQuery } from 'dexie'
import { exportWallet } from '../wallet/exportWallet'

import { useQuasar } from 'quasar'

const $q = useQuasar()
import CryptoJS from 'crypto-js'

const generateKey = (secret, salt) => {
  return CryptoJS.PBKDF2(
    secret,
    salt,
    {
      keySize: 512 / 32, // size in Words
      iterations: 1000,
      hasher: CryptoJS.algo.SHA512
    }
  )
}

const checkPasswordD = (password, hashedPassword) => {
  const saltString = hashedPassword.slice(0, 32)
  const saltWordArray = CryptoJS.enc.Hex.parse(saltString)
  const keyString = hashedPassword.slice(32)
  const newKeyString = generateKey(password, saltWordArray).toString()
  return (keyString === newKeyString)
}

const pwd = ref(null)
const password = ref(null)

getFromDb().then((value) => {
  pwd.value = value ? value.pwd : null
})

const decryptString = (str, salt) => {
  return JSON.parse(CryptoJS.AES.decrypt(
    str,
    salt
  ).toString(CryptoJS.enc.Utf8))
}
const amountOfWallet = ref('')
// const stack = ref('')
// const isMingledAddress = ref(false)

// const generateWallets = () => {
//   for (let i = 0; i < amountOfWallet.value; i++) {
//     genWallet()
//   }
// }

const showAll = async () => {
  const wallets = await dbData.wallet.toArray()
  const walletsMnemonics = []
  for (let i = 0; i < wallets.length; i++) {
    if (checkPasswordD(password.value, pwd.value)) {
      $q.notify({
        type: 'positive',
        message: 'Success'
      })
      const entropyD = decryptString(wallets[i].entropy, password.value)
      walletsMnemonics.push(wallets[i].id, await exportWallet(entropyD))
    } else {
      $q.notify({
        type: 'negative',
        message: 'Failure'
      })
    }
  }
  amountOfWallet.value = walletsMnemonics
  // console.log(wallets)
}

</script>
