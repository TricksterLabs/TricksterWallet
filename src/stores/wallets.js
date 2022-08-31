import { defineStore } from 'pinia'
import { dbData } from '../dexie/db'
import { liveQuery } from 'dexie'

import { ref, getCurrentScope, onScopeDispose } from 'vue'

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
  const wallets = useObservable(liveQuery(async () => { return await dbData.wallet.toArray() }), dbData.wallet.toArray())
  return { wallets }
})
