<template>
  <q-page
    class="q-pa-sm text-weight-bolder"
  >
    <q-card>
      <q-card-section>
        <div class="text-h6">
          Import Wallet
        </div>
      </q-card-section>
      <q-card-section class="col-12 items-center">
        <q-item class="full-width">
          <q-item-section>
            <q-toggle
              v-model="isMingledAddress"
              color="pink"
              label="Is Mingled Address"
            />
          </q-item-section>
        </q-item>
        <q-item
          class="full-width"
          v-if="isMingledAddress"
        >
          <q-item-section>
            <q-input
              dense
              v-model.number="stack"
              input-class=""
              label="Stack"
              outlined
            />
          </q-item-section>
        </q-item>
        <q-item class="full-width">
          <q-input
            v-model="address"
            outlined
            type="textarea"
            class="full-width"
            autogrow
          />
        </q-item>
      </q-card-section>
      <q-card-actions
        align="right"
        class="q-mr-lg q-pb-md"
      >
        <q-btn
          label="Import"
          color="positive"
          outline
          @click="importWallet"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { dbData, getFromDb } from '../dexie/db'
import CryptoJS from 'crypto-js'

const salt = 'my-secret-key@123'
const pwd = ref(null)

getFromDb().then((value) => {
  pwd.value = value ? value.pwd : null
})

const decryptString = (str) => {
  return JSON.parse(CryptoJS.AES.decrypt(
    str,
    salt
  ).toString(CryptoJS.enc.Utf8))
}

// import { liveQuery } from 'dexie'
import { generateWallet } from '../wallet/importWallet'

const stack = ref('')
const address = ref('')
const isMingledAddress = ref(false)

// const generateWallets = () => {
//   for (let i = 0; i < amountOfWallet.value; i++) {
//     genWallet()
//   }
// }

const importWallet = async () => {
  // console.log('address', address.value)
  const addressArray = address.value.split('\n')
  // console.log('addressArray', addressArray[1])
  // console.log('stack', stack.value)
  for (let i = 0; i < addressArray.length; i++) {
    try {
      const generateNewWallet = await generateWallet(addressArray[i], stack.value)

      const entropyData = CryptoJS.AES.encrypt(
        JSON.stringify(generateNewWallet.entropy),
        decryptString(pwd.value)
      ).toString()

      const addNewWallet = await dbData.wallet.put({
        entropy: entropyData,
        baseAddressExternal: { 0: generateNewWallet.baseAddressExternal },
        baseAddressInternal: { 0: generateNewWallet.baseAddressInternal },
        enterpriseAddressExternal: { 0: generateNewWallet.enterpriseAddressExternal },
        enterpriseAddressInternal: { 0: generateNewWallet.enterpriseAddressInternal },
        stakeAddress: generateNewWallet.stakeAddress,
        name: ''
      })
      await addNewWallet
      console.log(addNewWallet)
      if (typeof addNewWallet === 'number') {
      // await Promise.all([
        await dbData.wallet.update(addNewWallet, {
          name: 'Wallet ' + addNewWallet,
          balance: 0,
          utxo_set: []
        })
        await dbData.history.put({
          id: addNewWallet,
          last_height: 0,
          transactions: []
        })
      // ])
      }
    } catch (e) {
      console.log(e)
    }
  }
}

</script>
