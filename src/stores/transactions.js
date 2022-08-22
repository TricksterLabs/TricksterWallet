import { defineStore } from 'pinia'

// export interface TypeSelection {
//   asset_name: string;
//   policy_id: string;
//   walletName: string;
// }

// interface StateInterface {
//   selections: TypeSelection[];
// }

export const useTransactionStore = defineStore('transactions', {
  state: () => ({
    selections: []
  }),
  getters: {
    transactions: (state) => {
      const transactions = {}
      for (let i = 0; i < state.selections.length; i++) {
        const walletName = state.selections[i].walletName
        if (walletName) {
          if (!transactions[walletName]) transactions[walletName] = []
          transactions[walletName].push(state.selections[i])
        }
      }
      return Object.keys(transactions).map((x) => transactions[x])
    }
  },
  actions: {
    // eslint-disable-next-line camelcase
    removeSelect (asset_name) {
      this.selections = this.selections.filter(
        // eslint-disable-next-line camelcase
        (x) => x.asset_name !== asset_name
      )
    },
    clearSelection () {
      this.selections = []
    }
  }
})
