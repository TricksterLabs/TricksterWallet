<template>
  <q-page>
    <!-- page content -->
    <button @click="genWallet">
      Generate Wallet
    </button>
    <button @click="getWalletUtxo">
      Get Wallet Utxo
    </button>
    <button @click="getWalletTransactions">
      Get Wallet Transactions
    </button>
    <button @click="getAssetsInfo">
      Get Wallet Assets Info
    </button>
    <button @click="getUtxoData">
      Get UtxoData
    </button>
    <p>
      {{ newData }}
    </p>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios'
import { db } from 'boot/db'
// import { liveQuery } from 'dexie'
import { generateWallet } from '../wallet/generateWallet'
// import { useObservable } from '@vueuse/rxjs'

const currentPrimaryKey = 3
const newData = ref('dfas')

// const newData = useObservable(
//   liveQuery(async () => {

//   })
// )

const genWallet = async () => {
  try {
    const generateNewWallet = await generateWallet(24)
    const addNewWallet = await db.wallet.put({
      entropy: generateNewWallet.entropy,
      shelleyAddress0Bech32: generateNewWallet.shelleyAddress0Bech32,
      stakeAddressBech32: generateNewWallet.stakeAddressBech32
    })
    await addNewWallet
    if (typeof addNewWallet === 'number') {
      await Promise.all([
        await db.utxo_set.put({
          id: addNewWallet,
          name: '',
          balance: 0,
          utxo_set: [{
            tx_hash: '',
            tx_index: 0,
            block_height: 0,
            block_time: '',
            value: 0,
            datum_hash: '',
            asset_list: []
          }]
        }),
        await db.transactions.put({
          id: addNewWallet,
          transactions: [{
            tx_hash: '',
            epoch_no: 0,
            block_height: 0,
            block_time: ''
          }]
        })
      ])
    }
  } catch (e) {
    console.log(e)
  }
}

async function getWalletUtxo () {
  try {
    const currentWallet = await db.wallet.get(currentPrimaryKey)
    const wallet = await api.get('/address_info?_address=' + currentWallet?.shelleyAddress0Bech32)
    console.log(wallet.data.length)
    if (wallet.data.length > 0) {
      await db.utxo_set.put({
        id: currentPrimaryKey,
        balance: parseInt(wallet.data[0].balance),
        name: 'Wallet' + currentPrimaryKey.toString(),
        utxo_set: wallet.data[0].utxo_set
      })
    }
  } catch (e) {
    console.log(e)
  }
}

async function getWalletTransactions () {
  try {
    const currentWallet = await db.wallet.get(currentPrimaryKey)
    const wallet = await api.post('/address_txs', {
      _addresses: [
        currentWallet?.shelleyAddress0Bech32
      ],
      _after_block_height: 6238675
    })
    if (wallet.data.length > 0) {
      await db.transactions.put({
        id: currentPrimaryKey,
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
    const currentAsset = await db.utxo_set.get(currentPrimaryKey)
    if (typeof currentAsset === 'object') {
      for (let i = 0; i < currentAsset.utxo_set.length; i++) {
        for (let y = 0; y < currentAsset.utxo_set[i].asset_list.length; y++) {
          const asset = await api.get('https://api.opencnft.io/1/asset/' + currentAsset.utxo_set[i].asset_list[y].policy_id + currentAsset.utxo_set[i].asset_list[y].asset_name)
          // const current
          const transformedAsset = {
            last_metadata: asset.data.last_metadata,
            statistical_rank: asset.data.statistical_rank,
            statistical_score: asset.data.statistical_score,
            rarity_rank: asset.data.rarity_rank,
            rarity_score: asset.data.rarity_score
          }

          if (asset.data) {
            console.log(asset.data)
            console.log(currentAsset)
            await db.utxo_set.where('id').equals(currentPrimaryKey).modify(x => {
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
//     newData.value = await db.utxo_set.toArray()
//   } catch (e) {
//     console.log(e)
//   }
// }
</script>
