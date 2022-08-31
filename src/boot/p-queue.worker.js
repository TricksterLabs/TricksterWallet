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
  console.log('Lol')
  try {
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

      if (resultWalletUtxo.length > 0) {
        await dbData.wallet.update(id, {
          balance: parseInt(resultWalletUtxo[0].balance),
          last_height: resultNewTx[0].block_height,
          utxo_set: resultWalletUtxo[0].utxo_set
        })
      }
      if (typeof resultWalletUtxo === 'object') {
        console.log(resultWalletUtxo)
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
              console.log(resultWalletUtxo)
              await dbData.wallet.where('id').equals(id).modify(x => {
                x.utxo_set[i].asset_list[y].data = transformedAsset
              })
              // await dbData.wallet.update(id, {
              //   balance: parseInt(resultWalletUtxo[0].balance),
              //   last_height: resultNewTx[0].block_height,
              //   utxo_set: resultWalletUtxo[0].utxo_set
              // })
            }
          }
        }
      }
    }

    return
  } catch (e) {
    console.error(e)
  }
}

// let count = 0
// const getPolicyData = async () => {
//   try {
//     const res = await fetch('https://api.opencnft.io/1/policy/c204b7595ab87f70a4a4d3a6c40833e8942b990bacf492090fe8b4d3', {
//       method: 'GET',
//       headers: {
//         accept: 'application/json'
//       }
//     })
//     count = count + 1
//     console.log(count, await res.json())
//     return res
//   } catch (e) {
//     count = count + 1
//     console.error(count, e)
//   }
// }

// const tasksWallet = async () => {
//   const task = getTip
//   for (let i = 0; i < 1000; i++) {
//     // console.log('Adding to queue ' + i)
//     await queueWallet.add(task)
//     console.log('Wallet ' + i)
//   }
//   // console.log('Anonymous', task)
// }

// const taskArray = []
// const tasksPolicyData = async () => {
//   const task = getPolicyData
//   for (let i = 0; i < 1000; i++) {
//     taskArray.push(task)
//   }
//   await queueAnalytics.addAll(taskArray)
// }

// await tasksPolicyData()
// await tasksWallet()

// export { tasks }

// (async () => {
//   const task = await getTip(2)
//   await queue.add(task)
//   // console.log('Anonymous', task)
// })()

// export { getTip }

// self.port.start()

// self.onconnect = function (e) {
//   const port = e.ports[0] // get the port

//   port.onmessage = function (e) {
//     // console.log('Worker revceived arguments:', e.data)
//     port.postMessage('Hello from the worker!')
//   }
// }

// import pinia from 'pinia'

// const transactionArray = []
self.onconnect = (e) => {
  const port = e.ports[0]
  port.onmessage = async (e) => {
    const walletData = e.data
    console.log('Accessed')
    for (let i = 0; i < walletData.length; i++) {
      queueWallet.add(async () => await getTransactions(walletData[i].id, walletData[i].baseAddressExternal[0], walletData[i].last_height))
    }
    port.postMessage(walletData)
  }
}
