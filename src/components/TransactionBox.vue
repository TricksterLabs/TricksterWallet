<template>
  <q-list
    separator
    class="full-height q-pb-none q-mb-none flex column no-wrap"
  >
    <q-item
      class="flex justify-center items-center"
      style="min-height: 63px"
    >
      <q-item-label
        header
        class="text-capitalize text-weight-bold"
      >
        Transaction
      </q-item-label>
    </q-item>
    <q-item
      class="q-pa-none"
      style="min-height: 57px"
    >
      <q-tabs
        v-model="tab"
        no-caps
        outside-arrows
        dense
        mobile-arrows
        class="full-width"
        :class="$q.dark.isActive?'bg-dark':'bg-grey-1'"
      >
        <q-tab
          name="standard"
          label="Standard"
        />
        <!-- <q-tab
          name="one2many"
          label="One2Many"
        />
        <q-tab
          name="many2one"
          label="Many2One"
        /> -->
      </q-tabs>
    </q-item>
    <q-item
      class="q-mb-md q-pa-none"
      :style="$route.path=='/assets'?{'height': 'calc(100vh - 245px)'}:{'height': 'calc(100vh - 200px)'}"
    >
      <q-scroll-area class="fit">
        <q-list class="q-ma-sm">
          <q-expansion-item
            v-for="(nfts, i) in transactionsList"
            :key="`transaction-${nfts.walletName}`"
            expand-separator
            dense
            class="expansion-border"
            group="transactions"
            :class="i>0?'q-mt-xs':''"
            v-model="selectedWallet[i]"
          >
            <template #header>
              <q-item-section class="text-weight-bold">
                {{ nfts.walletName }}
              </q-item-section>

              <q-item-section
                side
              >
                <q-chip
                  outline
                  dense
                  square
                  color="deep-orange"
                  text-color="white"
                >
                  ADA: {{ nfts.quantity }}
                </q-chip>
              </q-item-section>
            </template>
            <div class="row">
              <div class="col-12">
                <q-btn
                  class="float-right text-capitalize q-mr-md"
                  icon="close"
                  flat
                  label="Remove"
                  dense
                  @click="store.removeTransactionData(i)"
                />
              </div>
              <q-item
                v-for="nft in nfts.assets"
                :key="nft.asset_name"
                dense
                class="q-px-xs"
              >
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="nft.image">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="ellipsis">
                    {{
                      shortenAddress(nft.asset_name)
                    }}
                  </q-item-label>
                  <q-item-label
                    class="wallet-text ellipsis"
                    caption
                  >
                    {{
                      nft.policy_id
                    }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-input
                    dense
                    v-model="nft.amount"
                    input-class=""
                    label="QTY"
                    debounce="0"
                    borderless
                    class="col-1 float-right"
                    style="width: 58px"
                    :rules="[ val => val <= nft.actual_amount || 'Max Value exceeded']"
                  />
                  <q-btn
                    icon="close"
                    flat
                    dense
                    round
                    @click="store.removeSelect(nft.asset_name, i)"
                  />
                </q-item-section>
              </q-item>
            </div>
          </q-expansion-item>
        </q-list>
      </q-scroll-area>
    </q-item>
    <q-item
      class="q-pa-none"
      v-if="selectedWallet"
    >
      <q-item-section
        class="col-6 bordered q-pa-md flex column no-wrap"
        style="margin: 0"
      >
        <q-input
          dense
          v-model.number="adaAmounts"
          input-class=""
          label="ADA to send"
          borderless
          class="number-input"
          type="number"
        />
      </q-item-section>
      <q-item-section
        class="col-3 bordered q-pa-md flex column no-wrap"
        style="margin: 0"
      >
        <q-input
          dense
          v-model="feeAmount"
          input-class=""
          label="Fee"
          borderless
          readonly
        />
      </q-item-section>
      <q-item-section
        class="col-3 bordered q-pa-md flex column no-wrap"
        style="margin: 0"
      >
        <q-input
          dense
          v-model="totalAmounts[selectedNum]"
          input-class=""
          label="Total"
          borderless
          readonly
          max
        />
      </q-item-section>
    </q-item>
    <q-input
      dense
      v-model="receivingAddress"
      input-class=""
      class="full-width q-px-xs q-mt-xs q-mb-xs"
      label="Receiving Address"
      outlined
    />
    <q-input
      v-model="password"
      outlined
      class="full-width q-px-xs q-mt-xs q-mb-xs"
      type="password"
      label="Password"
      dense
    />
    <q-btn
      size="21px"
      color="primary"
      outline
      :disable="receivingAddress === ''"
      @click="onSubmit"
      class="text-capitalize q-ma-xs"
      label="Submit"
    />
  </q-list>
</template>

<script setup>
import { shortenAddress } from 'src/utils'
import { useTransactionStore } from 'src/stores/transactions'
import { computed, ref } from 'vue'
import { singleSend } from '../wallet/singleSend'
import { getFromDb } from 'src/dexie/db'
import CryptoJS from 'crypto-js'
import { useQuasar } from 'quasar'
import { sendTx } from '../wallet/sendTx.js'
// import * as typhonjs from '@stricahq/typhonjs'

const store = useTransactionStore()
const tab = ref('standard')
const receivingAddress = ref('')
const selectedWallet = ref(Array(store.transactions.length).fill(false))
const selectedNum = computed(() => {
  return selectedWallet.value.indexOf(true)
})
const $q = useQuasar()
const pwd = ref(null)
const password = ref(null)

getFromDb().then((value) => {
  pwd.value = value ? value.pwd : null
})

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

const onSubmit = async () => {
  if (checkPasswordD(password.value, pwd.value)) {
    // console.log(JSON.parse(JSON.stringify(store.mapping_dict)))
    const fullTransaction = JSON.parse(JSON.stringify(store.mapping_dict))
    for (const property in fullTransaction) {
      // console.log(`${property}: ${fullTransaction[property].actual_quantity}`)
      const tx = await singleSend(
        password.value,
        parseInt(property),
        parseFloat(fullTransaction[property].quantity),
        fullTransaction[property].assets,
        receivingAddress.value
      )
      console.log('minUtxo', tx.minUtxo.toNumber())
      if (tx) {
        await sendTx(tx.txBuffer)
      }
    }
    $q.notify({
      type: 'positive',
      message: 'Success'
    })
  } else {
    $q.notify({
      type: 'negative',
      message: 'Wrong Password'
    })
  }
  // console.log('receiveingAddress', receivingAddress.value)
  // console.log('selectedWallet', selectedWallet.value)
  // console.log('totalAmounts', totalAmounts.value[0])
  // console.log('store.Transaction', JSON.parse(JSON.stringify(await store.transactions2)))
  // const adaQty = []
  // const txs = await store.transactions2

  // for (let i = 0; i < totalAmounts.value.length; i++) {
  //   adaQty.push(totalAmounts.value[i])
  // }

  // for (const property in txs) {
  //   await singleSend(
  //     totalAmounts.value[0],
  //     [property, txs[property]],
  //     receivingAddress.value
  //   )
  //   console.log(property, txs[property])
  //   console.log(receivingAddress.value)
  // }

  // console.log(txs[0])
  // txs.forEach((tx, i) => {
  //   if (selectedWallet.value[i]) {
  //     console.log('tx', tx)
  //     console.log('adaAmounts', adaAmounts.value[i])
  //     console.log('receivingAddress', receivingAddress.value)
  //     // singleSend(tx, adaAmounts.value[i], receivingAddress.value)
  //   }
  // })
  // console.log(await store.transactions2)
  // console.log(totalAmounts.value[0])
  // console.log(store.transactions2)
  // console.log(receivingAddress.value)

  // await singleSend(
  //   totalAmounts.value[0],
  //   store.transactions2,
  //   receivingAddress.value
  // )
}
const adaAmounts = ref(0)

const transactionsList = computed(() => {
  const finalDict = store.mapping
  store.transactions.filter(function (item, index) {
    item.filter(function (asset) {
      if (!(asset.walletId in store.mapping_dict)) {
        console.log(asset)
        store.mapping_dict[asset.walletId] = {
          walletName: asset.walletName,
          actual_quantity: asset.balance,
          quantity: adaAmounts.value,
          image: ('data' in asset && 'last_metadata' in asset.data && asset.data.last_metadata.image) ? asset.data.last_metadata.image.split('//')[1] : 'https://cdn.quasar.dev/img/avatar5.jpg',
          assets: []
        }
      }

      const assessMatch = store.mapping_dict[asset.walletId].assets.filter((x) => x.asset_name === asset.asset_name)
      if (assessMatch.length === 0) {
        // console.log(item)
        store.mapping_dict[asset.walletId].assets.push({
          image: 'data' in asset && 'last_metadata' in asset.data && asset.data.last_metadata.image ? 'https://nftstorage.link/ipfs/' + asset.data.last_metadata.image.split('//')[1] : 'https://cdn.quasar.dev/img/avatar5.jpg',
          asset_name: asset.asset_name,
          policy_id: asset.policy_id,
          actual_amount: asset.quantity,
          amount: asset.quantity,
          quantity: null
        })
      }
      return asset
    })
    return item
  })

  Object.keys(store.mapping_dict).filter(function (item) {
    store.mapping_dict[item].quantity = adaAmounts.value
    return item
  })
  store.setMapping(finalDict)
  return ref(finalDict).value
})
// const getTotalAmountMethod = (item) => {
//   let sum = 0
//   item.filter(function (asset) {
//     if (asset.quantity) {
//       sum = sum + asset.quantity ? asset.quantity : 0
//     }
//     return asset
//   })
//   return sum
// }
// const adaAmountss = ref(Array(Object.keys(transactionsList).length).fill(0))
const feeAmount = computed(() => 0)
const totalAmounts = computed(() => {
  return adaAmounts.value
})
//
// const maxAda = computed(() => {
//   return Object.keys(transactionsList.value).map(function (item) {
//     return transactionsList.value[item].actual_quantity / 1000
//   })
// })
</script>
