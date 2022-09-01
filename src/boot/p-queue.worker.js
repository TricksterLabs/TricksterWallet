import PQueue from 'p-queue'
// import { useWalletsStore } from 'stores/wallets'
import { dbData } from '../dexie/db'
import ky from 'ky'

const queueWallet = new PQueue({
  concurrency: 100, // Concurrency limit.
  timeout: 30000, // Per-operation timeout in milliseconds. Operations fulfill once timeout elapses if they haven't already.
  throwOnTimeout: false, // Whether or not a timeout is considered an exception.
  autoStart: true, // Whether queue tasks within concurrency limit, are auto-executed as soon as they're added.
  intervalCap: 100, // The max number of runs in the given interval of time.
  interval: 60000, // The length of time in milliseconds before the interval count resets. Must be finite.
  carryoverConcurrencyCount: true // If true, specifies that any pending Promises, should be carried over into the next interval and counted against the intervalCap. If false, any of those pending Promises will not count towards the next intervalCap.
})

// const queueAnalytics = new PQueue({
//   concurrency: 60, // Concurrency limit.
//   timeout: 30000, // Per-operation timeout in milliseconds. Operations fulfill once timeout elapses if they haven't already.
//   throwOnTimeout: false, // Whether or not a timeout is considered an exception.
//   autoStart: true, // Whether queue tasks within concurrency limit, are auto-executed as soon as they're added.
//   intervalCap: 60, // The max number of runs in the given interval of time.
//   interval: 60000, // The length of time in milliseconds before the interval count resets. Must be finite.
//   carryoverConcurrencyCount: true // If true, specifies that any pending Promises, should be carried over into the next interval and counted against the intervalCap. If false, any of those pending Promises will not count towards the next intervalCap.
// })

const getTransactions = async (id, address, lastHeight) => {
  try {
    const getTip = await fetch('https://eu-fr.trickster.fi/api/v0/tip', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'

      }
    })
    const resultGetTip = await getTip.json()
    console.log(id, resultGetTip[0].block_no)
    const newTx = await fetch('https://eu-fr.trickster.fi/api/v0/address_txs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // 'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(
        {
          _addresses: [
            address
          ],
          _after_block_height: lastHeight
        }
      )
    })
    const resultNewTx = await newTx.json()

    if (resultNewTx.length > 0) {
      console.log(resultNewTx[0].block_height)

      const walletUtxo = await fetch('https://eu-fr.trickster.fi/api/v0/address_info?_address=' + address, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const resultWalletUtxo = await walletUtxo.json()

      if (typeof resultWalletUtxo === 'object' && resultWalletUtxo.length > 0) {
        console.log(resultWalletUtxo[0].utxo_set[0].asset_list)
        if (resultWalletUtxo[0].utxo_set[0].asset_list[0]) {
          await dbData.wallet.update(id, {
            balance: parseInt(resultWalletUtxo[0].balance),
            last_height: resultGetTip[0].block_no,
            utxo_set: resultWalletUtxo[0].utxo_set
          })
          for (let i = 0; i < resultWalletUtxo[0].utxo_set.length; i++) {
            for (let y = 0; y < resultWalletUtxo[0].utxo_set[i].asset_list.length; y++) {
              const assetData = await ky.get('https://api.opencnft.io/1/asset/' + resultWalletUtxo[0].utxo_set[i].asset_list[y].policy_id + resultWalletUtxo[0].utxo_set[i].asset_list[y].asset_name).json()
              // console.log(assetFetch)
              // const assetData = await assetFetch.json()
              const transformedAsset = {
                ...assetData.last_metadata,
                statistical_rank: assetData.statistical_rank,
                rarity_rank: assetData.rarity_rank
              }

              if (assetData) {
                console.log(assetData)
                // console.log(resultWalletUtxo)
                await dbData.wallet.where('id').equals(id).modify(x => {
                  x.utxo_set[i].asset_list[y].data = transformedAsset
                })
              }
            }
          }
          return
        } else if (resultWalletUtxo.length > 0) {
          await dbData.wallet.update(id, {
            balance: parseInt(resultWalletUtxo[0].balance),
            last_height: resultGetTip[0].block_no,
            utxo_set: resultWalletUtxo[0].utxo_set
          })
          return
        }
      }
    } else {
      await dbData.wallet.update(id, {
        last_height: resultGetTip[0].block_no
      })
      return
    }
    return
  } catch (e) {
    console.error(e)
  }
}

self.onconnect = (e) => {
  const port = e.ports[0]
  port.onmessage = async (e) => {
    const walletData = e.data
    // console.log('Accessed')
    for (let i = 0; i < walletData.length; i++) {
      await queueWallet.add(async () => await getTransactions(walletData[i].id, walletData[i].baseAddressExternal[0], walletData[i].last_height))
    }
    port.postMessage(walletData)
  }
}
