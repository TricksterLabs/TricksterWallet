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
    classify: ref('assets'),
    mapping_dict: ref({})
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
    mapping: (state) => {
      return state.mapping_dict
    },
    transactions2: (state) => {
      const transactions = {}
      for (let i = 0; i < state.selections.length; i++) {
        const walletId = state.selections[i].walletId
        // const walletId = state.selections[i].walletId
        if (walletId) {
          // if (i === 0) {
          //   transactions[walletId].push({
          //     adaQty: 0
          //   // policyId: state.selections[i].policy_id,
          //   // amount: new BigNumber(state.selections[i].quantity)
          //   })
          // }
          if (!transactions[walletId]) transactions[walletId] = []
          // if (i === 0) {
          //   transactions[walletId].push({
          //     adaQty: new BigNumber(0)
          //   })
          // }
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
    removeSelect (assetName, id) {
      this.selections = this.selections.filter(
        // eslint-disable-next-line camelcase
        (x) => x.asset_name !== assetName
      )

      this.mapping_dict[id].assets = this.mapping_dict[id].assets.filter((x) => x.asset_name !== assetName)
    },
    clearSelection () {
      this.selections = []
    },
    WalletNumData (number, classify) {
      this.walletNum = number.toString()
      this.classify = classify.toString()
    },
    setMapping (data) {
      this.mapping_dict = data
    },
    setWalletData (data) {
      if (!(data.id in this.mapping_dict)) {
        this.mapping_dict[data.id] = {
          walletName: data.name,
          actual_quantity: data.balance,
          quantity: 0,
          assets: []
        }
      }
    },
    removeTransactionData (id) {
      const assetNames = this.mapping_dict[id].assets.map(x => x.asset_name)
      this.selections = this.selections.filter(
        // eslint-disable-next-line camelcase
        (x) => !assetNames.includes(x.asset_name)
      )
      delete this.mapping_dict[id]
    }
  }
})
