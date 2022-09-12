<template>
  <q-page>
    <q-list class="flex no-wrap">
      <q-item class="full-width">
        <q-input
          v-model="searchText"
          class="full-width"
          borderless
          label="Search.."
          dense
        />
      </q-item>
      <q-item>
        <q-btn>SORT</q-btn>
      </q-item>
      <q-item>
        <q-btn>FILTER</q-btn>
      </q-item>
    </q-list>
    <q-separator />

    <q-separator />
    <div class="fit-main">
      <q-scroll-area class="fit">
        <q-list>
          <q-expansion-item
            v-for="(nft, policyId) in walletList"
            :key="policyId"
            :expand-separator="false"
            :label="$q.screen.gt.md?policyId:shortenPolicy(policyId)"
            default-opened
            class="expansion-border q-ma-sm"
            :header-class="$q.screen.gt.md?'expansion-border-header text-center':'expansion-border-header'"
          >
            <template
              v-for="item in nft"
              :key="item.id"
            >
              <q-expansion-item
                v-for="asset in item.asset_list"
                :key="`asset-${asset.asset_name}`"
                class="expansion-border q-ma-sm"
                :expand-separator="false"
              >
                <template #header>
                  <q-checkbox
                    v-model="store.selections"
                    :val="asset"
                  />
                  <q-item-section avatar>
                    <q-avatar>
                      <img :src="asset.data.image?'https://nftstorage.link/ipfs/'+asset.data.image.split('//')[1]:'https://cdn.quasar.dev/img/avatar5.jpg'">
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-weight-bold">
                      {{ asset.realName }}
                    </q-item-label>
                    <q-item-label
                      caption
                      class="text-weight-bold"
                    >
                      {{ asset.walletName }} /  {{ $q.screen.gt.md?asset.asset_name:shortenPolicy(asset.asset_name) }}
                    </q-item-label>
                    <q-item-label
                      caption
                      class="text-weight-bold"
                    >
                      <q-chip
                        outline
                        square
                        dense
                        color="cyan-7"
                        text-color="white"
                        v-if="asset.data.statistical_rank"
                      >
                        Statistical Rank - {{ asset.data.statistical_rank }}
                      </q-chip>
                      <q-chip
                        outline
                        square
                        dense
                        color="light-blue-8"
                        text-color="white"
                        v-if="asset.data.rarity_rank"
                      >
                        Rarity Rank - {{ asset.data.rarity_rank }}
                      </q-chip>
                      <q-chip
                        v-if="!$q.screen.gt.md"
                        outline
                        square
                        dense
                        color="red"
                        text-color="white"
                      >
                        {{ asset.quantity }}x
                      </q-chip>
                    </q-item-label>
                    <q-item-label
                      caption
                      class="text-weight-bold"
                    />
                  </q-item-section>
                  <q-item-section
                    side
                    v-if="$q.screen.gt.md"
                  >
                    <q-chip
                      outline
                      square
                      dense
                      color="red"
                      text-color="white"
                    >
                      {{ asset.quantity }}x
                    </q-chip>
                  </q-item-section>
                </template>
                <q-card
                  style="border-bottom-right-radius: 8px;border-bottom-left-radius: 8px;"
                  class="no-border no-shadow"
                  :class="$q.dark.isActive?'bg-dark':'bg-grey-2'"
                >
                  <q-card-section
                    class="row q-p-xs"
                  >
                    <div class="col-12 row">
                      <div class="text-h6 col-12 text-weight-bold">
                        Properties
                      </div>
                      <q-input
                        dense
                        v-if="asset.asset_name"
                        v-model="asset.asset_name"
                        input-class=""
                        label="Asset Name"
                        borderless
                        :class="$q.screen.gt.md?'col-6':'col-12'"
                        readonly
                      />

                      <q-input
                        dense
                        v-if="asset.policy_id"
                        v-model="asset.policy_id"
                        input-class=""
                        label="Policy Id"
                        :class="$q.screen.gt.md?'col-6':'col-12'"
                        borderless
                        readonly
                      />

                      <q-input
                        v-if="asset.quantity"
                        dense
                        v-model="asset.quantity"
                        input-class=""
                        label="Quantity"
                        :class="$q.screen.gt.md?'col-6':'col-12'"
                        borderless
                        readonly
                      />

                      <template v-if="asset.hasOwnProperty('data')">
                        <template
                          :key="data"
                          v-for="data in Object.keys(asset.data)"
                        >
                          <q-input
                            v-if="data!='files'"
                            dense
                            :model-value="asset.data[data]"
                            input-class=""
                            :class="$q.screen.gt.md?'col-6':'col-12'"
                            borderless
                            readonly
                            :label-slot="true"
                          >
                            <template #label>
                              <span class="text-capitalize">
                                {{ data.split('_').join(' ') }}
                              </span>
                            </template>
                          </q-input>
                        </template>
                      </template>
                    </div>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </template>
          </q-expansion-item>
        </q-list>
      </q-scroll-area>
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTransactionStore } from 'stores/transactions'
import { useWalletsStore } from 'stores/wallets'
import { shortenPolicy } from 'src/utils'

const searchText = ref('')
const store = useTransactionStore()
// const walletStore = useWalletsStore()
const { wallets } = storeToRefs(useWalletsStore())

const walletList = computed(() => {
  const data = {}
  const walletsRefs = JSON.parse(JSON.stringify(wallets.value))
  // console.log('walletRefs', walletsRefs)
  const walletnum = store.walletNum
  if (walletsRefs && walletsRefs.length !== 0) {
    // console.log('refs', walletsRefs)
    for (let i = 0; i < walletsRefs.length; i++) {
      if (walletnum === 'all' || (walletnum && walletsRefs[i].id === walletsRefs[Number(walletnum) - 1].id)) {
        const filteredUTXOSet = walletsRefs[i].utxo_set?.filter(
          (item) =>
            searchText.value === '' ||
            item.asset_list[0].asset_name
              .toLowerCase()
              .includes(searchText.value.toLowerCase()) ||
              item.asset_list[0].policy_id
                .toLowerCase()
                .includes(searchText.value.toLowerCase())
        ) || []
        filteredUTXOSet.forEach((item) => {
          for (let y = 0; y < item.asset_list.length; y++) {
            // if (data[item.asset_list[y].policy_id][0].asset_list[0].asset_name) {
            //   data[item.asset_list[y].policy_id][0].asset_list[0].quantity += item.asset_list[y].quantity
            // } else {
            //   data[item.asset_list[y].policy_id] = [item]
            // }
            if (data[item.asset_list[y].policy_id]) {
              // if (data[item.asset_list[y].policy_id][0].asset_list[0].asset_name) {
              //   // data[item.asset_list[y].policy_id][0].asset_list[0].quantity += parseInt(item.asset_list[y].quantity)
              //   data[item.asset_list[y].policy_id][0].asset_list[0].quantity = parseInt(data[item.asset_list[y].policy_id][0].asset_list[0].quantity) + parseInt(item.asset_list[y].quantity)
              // } else {
              //   data[item.asset_list[y].policy_id][0].asset_list[0].quantity = parseInt(item.asset_list[y].quantity)
              // }
              // console.log('item', item)
              data[item.asset_list[y].policy_id].push({
                // asset_list: item.asset_list.map((assetListItem) => ({
                //   ...assetListItem,
                //   data: assetListItem.data || {},
                //   realName: assetListItem.data?.name || '',
                //   walletName: walletsRefs[i].name,
                //   walletId: walletsRefs[i].id
                // }))
                asset_list: [{
                  ...item.asset_list[y],
                  // asset_name: item.asset_list[i].asset_name,
                  // policy_id: item.asset_list[i].policy_id,
                  realName: item.asset_list[y].data.name,
                  walletName: walletsRefs[i].name,
                  walletId: walletsRefs[i].id
                // data: item.asset_list[i].data
                }]
              })

              // console.log(item.asset_list[i])
            } else {
              data[item.asset_list[y].policy_id] = [{
                asset_list: [{
                  ...item.asset_list[y],
                  // asset_name: item.asset_list[i].asset_name,
                  // policy_id: item.asset_list[i].policy_id,
                  realName: item.asset_list[y].data.name,
                  walletName: walletsRefs[i].name,
                  walletId: walletsRefs[i].id
                // data: item.asset_list[i].data
                }]
              }]
            }
          }
          // item.asset_list.forEach((assetListItem) => {
          //   if (data[assetListItem.policy_id]) {
          //     console.log(item)
          //     data[assetListItem.policy_id].push({
          //       // ...item
          //       asset_list: item.asset_list.map((assetListItem) => ({
          //         ...assetListItem,
          //         data: assetListItem.data || {},
          //         realName: assetListItem.data?.name || '',
          //         walletName: walletsRefs[i].name || '',
          //         walletId: walletsRefs[i].id || ''
          //       }))
          //     })
          //   } else {
          //     data[assetListItem.policy_id] = [{
          //       // ...item
          //       asset_list: item.asset_list.map((assetListItem) => ({
          //         ...assetListItem,
          //         data: assetListItem.data || {},
          //         realName: assetListItem.data?.name || '',
          //         walletName: walletsRefs[i].name,
          //         walletId: walletsRefs[i].id
          //       }))
          //     }]
          //   }
          // })
        })
      }
    }
  }
  // console.log('data', data)
  return data
})

const walletList2 = computed(() => {
  const data = {}
  const walletsRefs = JSON.parse(JSON.stringify(wallets.value))
  // console.log('walletRefs', walletsRefs)
  const walletnum = store.walletNum
  if (walletsRefs && walletsRefs.length !== 0) {
    // console.log('refs', walletsRefs)
    for (let i = 0; i < walletsRefs.length; i++) {
      if (walletnum === 'all' || (walletnum && walletsRefs[i].id === walletsRefs[Number(walletnum) - 1].id)) {
        const filteredUTXOSet = walletsRefs[i].utxo_set?.filter(
          (item) =>
            searchText.value === '' ||
            item.asset_list[0].asset_name
              .toLowerCase()
              .includes(searchText.value.toLowerCase()) ||
              item.asset_list[0].policy_id
                .toLowerCase()
                .includes(searchText.value.toLowerCase())
        ) || []
        filteredUTXOSet.forEach((item) => {
          for (let y = 0; y < item.asset_list.length; y++) {
            if (data[item.asset_list[y].policy_id]) {
              if (data[item.asset_list[y].policy_id][item.asset_list[y].asset_name]) {
                if (data[item.asset_list[y].policy_id][item.asset_list[y].asset_name][walletsRefs[i].id]) {
                  data[item.asset_list[y].policy_id][item.asset_list[y].asset_name][walletsRefs[i].id].quantity = (parseInt(data[item.asset_list[y].policy_id][item.asset_list[y].asset_name][walletsRefs[i].id].quantity) + parseInt(item.asset_list[y].quantity)).toString()
                } else {
                  data[item.asset_list[y].policy_id][item.asset_list[y].asset_name][walletsRefs[i].id] = {
                    ...item.asset_list[y]
                  }
                }
              } else {
                data[item.asset_list[y].policy_id][item.asset_list[y].asset_name] = {
                  [walletsRefs[i].id]: {
                    ...item.asset_list[y]
                  }
                }
              }
            } else {
              data[item.asset_list[y].policy_id] = {
                [item.asset_list[y].asset_name]: {
                  [walletsRefs[i].id]: {
                    ...item.asset_list[y]
                  }
                }
              }
            }
          }
        })
      }
    }
  }
  console.log('data', data)
  return data
})
console.log(walletList2)

// watch(walletList, (val) => {
//   console.log('walletList', JSON.parse(JSON.stringify(val)))
// })
</script>
