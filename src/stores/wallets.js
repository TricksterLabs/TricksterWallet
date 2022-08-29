import { defineStore } from 'pinia'
import { dbData } from '../dexie/db'
import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'
// import { ref } from 'vue'

// export interface TypeSelection {
//   asset_name: string;
//   policy_id: string;
//   walletName: string;
// }

// interface StateInterface {
//   selections: TypeSelection[];
// }

export const useWalletsStore = defineStore('wallets', () => {
  const wallets = useObservable(liveQuery(async () => await dbData.wallet.toArray()))
  return { wallets }
})

// export const useWalletsStore = defineStore('wallets', {
//   state: () => ({
//     wallets: []
//   }),

//   getters: {
//     wallets: (state) => {
//       state.wallets = useObservable(liveQuery(() => dbData.wallet.toArray()))
//     }

//   }
// })
