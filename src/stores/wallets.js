import { defineStore } from 'pinia'
import { dbData } from '../dexie/db'
import { liveQuery } from 'dexie'
import { computed, ref, getCurrentScope, onScopeDispose } from 'vue'

function tryOnScopeDispose (fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn)
    return true
  }
  return false
}

function useObservable (observable, options) {
  // const value = ref(options == null ? void 0 : options.initialValue)
  const value = ref(options)
  const subscription = observable.subscribe({
    // eslint-disable-next-line no-return-assign
    next: (val) => value.value = val,
    error: options == null ? void 0 : options.onError
  })
  tryOnScopeDispose(() => {
    subscription.unsubscribe()
  })
  return value
}

export const useWalletsStore = defineStore('wallets', () => {
  const wallets = useObservable(liveQuery(async () => { return await dbData.wallet.toArray() }), new Proxy(dbData.wallet.toArray(), {}))
  const history = useObservable(liveQuery(async () => { return await dbData.history.toArray() }), new Proxy(dbData.history.toArray(), {}))
  const walletList = computed(() => {
    const data = {}
    const walletsRefs = JSON.parse(JSON.stringify(wallets.value))
    console.log('walletRefs', walletsRefs)
    // const walletnum = route.params.walletnum
    if (walletsRefs && walletsRefs.length !== 0) {
    // console.log(walletsRefstore)
      for (let i = 0; i < walletsRefs.length; i++) {
        // if (walletnum === 'all' || (walletnum && walletsRefs[i].id === walletsRefs[Number(walletnum) - 1].id)) {
        //   const filteredUTXOSet = walletsRefs[i].utxo_set?.filter(
        //     (item) =>
        //       searchText.value === '' ||
        //     item.asset_list[0].asset_name
        //       .toLowerCase()
        //       .includes(searchText.value.toLowerCase()) ||
        //       item.asset_list[0].policy_id
        //         .toLowerCase()
        //         .includes(searchText.value.toLowerCase())
        //   ) || []
        walletsRefs[i].utxo_set.forEach((item) => {
          item.asset_list.forEach((assetListItem) => {
            if (data[assetListItem.policy_id]) {
              data[assetListItem.policy_id].push({
                // ...item
                asset_list: item.asset_list.map((assetListItem) => ({
                  ...assetListItem,
                  data: assetListItem.data || {},
                  realName: assetListItem.data?.name || '',
                  walletName: walletsRefs[i].name,
                  walletId: walletsRefs[i].id
                }))
              })
            } else {
              data[assetListItem.policy_id] = [{
                // ...item
                asset_list: item.asset_list.map((assetListItem) => ({
                  // ...assetListItem,
                  data: assetListItem.data || {},
                  realName: assetListItem.data?.name || '',
                  walletName: walletsRefs[i].name,
                  walletId: walletsRefs[i].id
                }))
              }]
            }
          })
        })
      }
    }
    return data
  })

  return { wallets, walletList, history }
})
