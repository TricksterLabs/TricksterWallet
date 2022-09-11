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

const getTransactions = async (id, address, lastHeight, transactionsOld) => {
  console.log('Working', transactionsOld)
  try {
    const getTip = await fetch('https://eu-de.trickster.fi/api/v0/tip', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'

      }
    })
    const resultGetTip = await getTip.json()
    // console.log(id, resultGetTip[0].block_no)
    // console.log(lastHeight)
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
          // _after_block_height: 0
        }
      )
    })
    const resultNewTx = await newTx.json()
    // console.log('resultNewTx', resultNewTx.length)

    if (resultNewTx[0]) {
      // console.log('blockHeight', resultNewTx[0].block_height)

      const walletUtxo = await fetch('https://eu-fr.trickster.fi/api/v0/address_info?_address=' + address, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const resultWalletUtxo = await walletUtxo.json()

      // if (typeof resultWalletUtxo === 'object' && resultWalletUtxo.utxo_set.length > 0) {
      // if (resultWalletUtxo.length > 0) {
      //   for (let i = 0; i < resultWalletUtxo.length; i++) {
      //     await dbData.wallet.update(id, {
      //       utxo_set:
      //     })
      //   }

      // const addHexNames = (utxoSet) => {
      //   const newArray = []
      //   if (utxoSet.length > 0) {
      //     for (let i = 0; i < utxoSet.length; i++) {
      //       for (let y = 0; y < utxoSet[i].asset_list.length; y++) {
      //         console.log(utxoSet[i].asset_list[y].asset_name)
      //         newArray.push({
      //           ...utxoSet[i].asset_list[y],

      //         })
      //       }
      //     }
      //   }
      // }
      // }
      if (typeof resultWalletUtxo === 'object' && resultWalletUtxo.length > 0) {
        console.log('old', transactionsOld)
        if (resultWalletUtxo[0]) {
          await dbData.wallet.update(id, {
            balance: parseInt(resultWalletUtxo[0].balance),
            // last_height: resultGetTip[0].block_no,
            utxo_set: resultWalletUtxo[0].utxo_set
          })
          await dbData.history.update(id, {
            last_height: resultGetTip[0].block_no,
            transactions: [...resultNewTx, ...transactionsOld]
          })

          if (resultWalletUtxo[0].utxo_set[0]) {
            for (let i = 0; i < resultWalletUtxo[0].utxo_set.length; i++) {
              if (resultWalletUtxo[0].utxo_set[i].asset_list[0]) {
                for (let y = 0; y < resultWalletUtxo[0].utxo_set[i].asset_list.length; y++) {
                  const assetData = await ky.get('https://api.opencnft.io/1/asset/' + resultWalletUtxo[0].utxo_set[i].asset_list[y].policy_id + resultWalletUtxo[0].utxo_set[i].asset_list[y].asset_name).json()
                  // console.log('test35', assetData)
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
                    // x.utxo_set[i].asset_list[y].data = transformedAsset
                      x.utxo_set[i].asset_list[y] = {
                        data: transformedAsset,
                        asset_name: x.utxo_set[i].asset_list[y].asset_name,
                        policy_id: x.utxo_set[i].asset_list[y].policy_id,
                        quantity: x.utxo_set[i].asset_list[y].quantity,
                        asset_name_hex: (x.utxo_set[i].asset_list[y].asset_name).match(/.{1,2}/g).reduce((acc, char) => acc + String.fromCharCode(parseInt(char, 16)), '').toUpperCase()
                      }
                    })
                  }
                }
              }
            }
            return
          }
        } else if (resultWalletUtxo.length > 0) {
          await dbData.wallet.update(id, {
            balance: parseInt(resultWalletUtxo[0].balance),
            // last_height: resultGetTip[0].block_no,
            utxo_set: resultWalletUtxo[0].utxo_set
          })
          await dbData.history.update(id, {
            last_height: resultGetTip[0].block_no
          })
          return
        }
      }
    } else {
      await dbData.history.update(id, {
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
    console.log(walletData)
    for (let i = 0; i < walletData.length; i++) {
      await queueWallet.add(async () => await getTransactions(walletData[i].id, walletData[i].baseAddressExternal[0], walletData[i].last_height, walletData[i].transactions)
      )
    }
    port.postMessage(walletData)
  }
}
