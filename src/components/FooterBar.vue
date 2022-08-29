<template>
  <q-toolbar class="q-pa-none">
    <q-separator />
    <q-btn
      color="secondary"
      @click="genWallet"
    >
      GEN WALLET
    </q-btn>
    <q-btn
      color="secondary"
      @click="getWalletUtxo"
    >
      GET UTXOs
    </q-btn>
    <q-btn
      color="secondary"
      @click="getWalletTransactions"
    >
      GET TXs
    </q-btn>
    <q-btn
      color="secondary"
      @click="getAssetsInfo"
    >
      GET ASSETs
    </q-btn>
    <!-- <q-btn
      color="secondary"
      @click="getUtxoData"
    >
      Get UtxoData
    </q-btn> -->
    <q-list class="footer-bar">
      <q-item>
        <q-item-section dense>
          Last Refresh: {{ lastTime }}
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section dense>
          Now: {{ currentTime }}
        </q-item-section>
      </q-item>
      <q-item>
        <q-toggle
          dense
          v-model="isLight"
          size="md"
          checked-icon="light_mode"
          color="grey"
          unchecked-icon="dark_mode"
          @click="$q.dark.toggle()"
        />
      </q-item>
      <q-item>
        <q-item-section dense>
          Version: 2.0.0 BETA
        </q-item-section>
      </q-item>
    </q-list>
  </q-toolbar>
</template>

<script setup>
import { onMounted, onUnmounted, onUpdated, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { dbData } from '../dexie/db'
// import { liveQuery } from 'dexie'
import { generateWallet } from '../wallet/generateWallet'
// import { useObservable } from '@vueuse/rxjs'

const currentPrimaryKey = 2

// const newData = useObservable(
//   liveQuery(async () => {

//   })
// )

const genWallet = async () => {
  try {
    const generateNewWallet = await generateWallet(24)
    const addNewWallet = await dbData.wallet.put({
      entropy: generateNewWallet.entropy,
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
        transactions: []
      })
      // ])
    }
  } catch (e) {
    console.log(e)
  }
}

async function getWalletUtxo () {
  try {
    const currentWallet = await dbData.wallet.get(currentPrimaryKey)
    const wallet = await api.get('/address_info?_address=' + currentWallet?.baseAddressExternal[0])
    console.log(wallet.data.length)
    if (wallet.data.length > 0) {
      await dbData.wallet.update(currentPrimaryKey, {
        balance: parseInt(wallet.data[0].balance),
        utxo_set: wallet.data[0].utxo_set
      })
    }
  } catch (e) {
    console.log(e)
  }
}

async function getWalletTransactions () {
  try {
    const currentWallet = await dbData.wallet.get(currentPrimaryKey)
    const wallet = await api.post('/address_txs', {
      _addresses: [
        currentWallet?.baseAddressExternal[0]
      ],
      _after_block_height: 6238675
    })
    if (wallet.data.length > 0) {
      await dbData.history.update(currentPrimaryKey, {
        transactions: wallet.data
      })
      await wallet
      console.log(wallet)
    }
  } catch (e) {
    console.log(e)
  }
}

async function getAssetsInfo () {
  try {
    const currentAsset = await dbData.wallet.get(currentPrimaryKey)
    if (typeof currentAsset === 'object') {
      for (let i = 0; i < currentAsset.utxo_set.length; i++) {
        for (let y = 0; y < currentAsset.utxo_set[i].asset_list.length; y++) {
          const asset = await api.get('https://api.opencnft.io/1/asset/' + currentAsset.utxo_set[i].asset_list[y].policy_id + currentAsset.utxo_set[i].asset_list[y].asset_name)
          // const current
          const transformedAsset = {
            ...asset.data.last_metadata,
            statistical_rank: asset.data.statistical_rank,
            // statistical_score: asset.data.statistical_score,
            rarity_rank: asset.data.rarity_rank
            // rarity_score: asset.data.rarity_score
          }

          if (asset.data) {
            console.log(asset.data)
            console.log(currentAsset)
            await dbData.wallet.where('id').equals(currentPrimaryKey).modify(x => {
              x.utxo_set[i].asset_list[y].data = transformedAsset
            })
          }
        }
      }
    }
    // newData = newData.value + 1
  } catch (e) {
    console.log(e)
  }
}

// async function getUtxoData () {
//   try {
//     newData.value = await dbData.utxo_set.toArray()
//   } catch (e) {
//     console.log(e)
//   }
// }

const $q = useQuasar()

const lastTime = ref(new Date(Date.now()).toLocaleString())
const currentTime = ref(new Date(Date.now()).toLocaleString())
const isLight = ref(!$q.dark.isActive)

let timer

onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date(Date.now()).toLocaleString()
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
onUpdated(() => {
  lastTime.value = new Date(Date.now()).toLocaleString()
})
</script>
