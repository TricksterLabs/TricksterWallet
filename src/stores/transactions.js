import { defineStore } from 'pinia'
import BigNumber from 'bignumber.js'
import { ref } from 'vue'

// console.log(BigNumber)

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
    selections: [],
    walletNum: ref('all'),
    classify: ref('assets')
  }),
  getters: {
    transactions: (state) => {
      const transactions = {}
      for (let i = 0; i < state.selections.length; i++) {
        const walletName = state.selections[i].walletName
        // const walletId = state.selections[i].walletId
        if (walletName) {
          if (!transactions[walletName]) transactions[walletName] = []
          transactions[walletName].push(state.selections[i])
        }
        // if ()
      }
      return Object.keys(transactions).map((x) => transactions[x])
    },
    transactions2: (state) => {
      const transactions = {}
      for (let i = 0; i < state.selections.length; i++) {
        const walletId = state.selections[i].walletId
        // const walletId = state.selections[i].walletId
        if (walletId) {
          if (!transactions[walletId]) transactions[walletId] = []
          transactions[walletId].push({
            assetName: state.selections[i].asset_name,
            policyId: state.selections[i].policy_id,
            amount: new BigNumber(state.selections[i].quantity)
          })
        }
      }
      return transactions
    },
    walletNumGet: (state) => {
      return state.walletNum
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
    },
    WalletNumData (number, classify) {
      this.walletNum = number.toString()
      this.classify = classify.toString()
    }
  }
})
