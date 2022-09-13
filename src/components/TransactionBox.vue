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
            v-for="(nfts, i) in store.transactions"
            :key="`transaction-${nfts[0].walletName}`"
            expand-separator
            dense
            class="expansion-border"
            group="transactions"
            :class="i>0?'q-mt-xs':''"
            v-model="selectedWallet[i]"
          >
            <template #header>
              <q-item-section class="text-weight-bold">
                {{ nfts[0].walletName }}
              </q-item-section>

              <q-item-section
                caption
                side
              >
                <q-chip
                  outline
                  dense
                  square
                  color="deep-orange"
                  text-color="white"
                >
                  ADA: {{ totalAmounts[i] }}
                </q-chip>
              </q-item-section>
            </template>
            <q-item
              v-for="nft in nfts"
              :key="nft.asset_name"
              dense
              class="q-px-xs"
            >
              <q-item-section avatar>
                <q-avatar>
                  <img :src="nft.hasOwnProperty('data') && nft.data.hasOwnProperty('last_metadata') && nft.data.last_metadata.hasOwnProperty('image') && nft.data.last_metadata.image?'https://nftstorage.link/ipfs/'+nft.data.last_metadata.image.split('//')[1]:'https://cdn.quasar.dev/img/avatar5.jpg'">

                  <!-- <img :src="nft.data.image?'https://nftstorage.link/ipfs/'+nft.data.image.split('//')[1]:'https://cdn.quasar.dev/img/avatar5.jpg'"> -->
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
                <q-btn
                  icon="close"
                  flat
                  dense
                  round
                  @click="store.removeSelect(nft.asset_name)"
                />
              </q-item-section>
            </q-item>
          </q-expansion-item>
        </q-list>
      </q-scroll-area>
    </q-item>
    <q-item
      class="q-pa-none"
      v-if="selectedWallet.includes(true)"
    >
      <q-item-section
        class="col-6 bordered q-pa-md flex column no-wrap"
        style="margin: 0"
      >
        <q-input
          dense
          v-model.number="adaAmounts[selectedNum]"
          input-class=""
          label="ADA to send"
          borderless
          class="number-input"
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

const store = useTransactionStore()
const tab = ref('standard')
const receivingAddress = ref('')
const selectedWallet = ref(Array(store.transactions.length).fill(false))
const selectedNum = computed(() => {
  return selectedWallet.value.indexOf(true)
})
const adaAmounts = ref(Array(store.transactions.length).fill(0))
const feeAmount = computed(() => 0)
const totalAmounts = computed(() => {
  return adaAmounts.value.map(
    (x, i) => (Number(adaAmounts.value[i]) || 0)
  )
})
const onSubmit = async () => {
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
  console.log(totalAmounts.value[0])
  console.log(store.transactions2)
  console.log(receivingAddress.value)
  await singleSend(
    totalAmounts.value[0],
    store.transactions2,
    receivingAddress.value
  )
}
</script>
