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
        >
        </q-input>
      </q-item>
      <q-item>
        <q-btn>SORT</q-btn>
      </q-item>
      <q-item>
        <q-btn>FILTER</q-btn>
      </q-item>
    </q-list>
    <q-separator />

    <q-separator></q-separator>
    <div class="fit-main">
      <q-scroll-area class="fit">
        <q-list>
          <q-expansion-item
            v-for="(nft, policyId) in walletList"
            :key="policyId"
            :expand-separator="false"
            :label="policyId"
            default-opened
            class="expansion-border q-ma-sm"
            header-class="expansion-border-header text-center"
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
                    <q-item-label class="text-weight-bold">{{ asset.realName }}</q-item-label>
                    <q-item-label caption class="text-weight-bold">
                      {{ asset.walletName }} / {{ asset.asset_name }}
                    </q-item-label>
                    <q-item-label caption class="text-weight-bold">
                      <q-chip outline square dense color="cyan-7" text-color="white" v-if="asset.data.statistical_rank">
                      Statistical Rank - {{ asset.data.statistical_rank }}
                      </q-chip>
                      <q-chip outline square dense color="light-blue-8" text-color="white" v-if="asset.data.rarity_rank">
                      Rarity Rank - {{ asset.data.rarity_rank }}
                      </q-chip>
                    </q-item-label>
                    <q-item-label caption class="text-weight-bold">

                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-chip outline square dense color="red" text-color="white">
                      {{ asset.quantity }}x
                    </q-chip>
                  </q-item-section>
                </template>
                <q-card
                  style="border-bottom-right-radius: 8px;border-bottom-left-radius: 8px;"
                  class="no-border no-shadow"
                  :class="$q.dark.isActive?'bg-dark':'bg-grey-2'">
                  <q-card-section
                    class="row q-p-xs">
                    <div class="col-8">
                      <div class="text-h6 text-weight-bold">
                        Properties
                      </div>
                      <q-input
                        dense
                        v-model="asset.asset_name"
                        input-class=""
                        label="Asset Name"
                        borderless
                        readonly
                      />
                      <q-input
                        dense
                        v-model="asset.policy_id"
                        input-class=""
                        label="Policy Id"
                        borderless
                        readonly
                      />
                      <q-input
                        dense
                        model-value="fg43f43"
                        input-class=""
                        label="Fingerprint"
                        borderless
                        readonly
                      />

                      <q-input
                        dense
                        model-value="721"
                        input-class=""
                        label="Metadata Type"
                        borderless
                        readonly
                      />

                      <q-input
                        dense
                        :model-value="asset.data.mediaType ?? 'image/jpeg'"
                        input-class=""
                        label="Sources Type"
                        borderless
                        readonly
                      />

                      <q-input
                        dense
                        v-model="asset.data.image"
                        input-class=""
                        label="Source Link"
                        borderless
                        readonly
                      >
                      </q-input>

                      <q-input
                        dense
                        v-model="asset.quantity"
                        input-class=""
                        label="Quantity"
                        borderless
                        readonly
                      />
                    </div>
                    <div class="col-4">
                      <div class="text-h6 text-weight-bold">
                        Metadata
                      </div>
                      <q-input
                        dense
                        model-value="Yes"
                        input-class=""
                        label="Legs"
                        borderless
                        readonly
                      />
                      <q-input
                        dense
                        model-value="Yes"
                        input-class=""
                        label="Head"
                        borderless
                        readonly
                      />
                      <q-input
                        dense
                        model-value="Yes"
                        input-class=""
                        label="Hands"
                        borderless
                        readonly
                      />
                      <q-input
                        dense
                        model-value="Yes"
                        input-class=""
                        label="Body"
                        borderless
                        readonly
                      />
                      <q-input
                        dense
                        model-value="Yes"
                        input-class=""
                        label="Eyes"
                        borderless
                        readonly
                      />
                      <q-input
                        dense
                        model-value="Yes"
                        input-class=""
                        label="Mouth"
                        borderless
                        readonly
                      />
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
    // console.log(walletsRefstore)
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
          item.asset_list.forEach((assetListItem) => {
            if (data[assetListItem.policy_id]) {
              data[assetListItem.policy_id].push({
                // ...item,
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
                // ...item,
                asset_list: item.asset_list.map((assetListItem) => ({
                  ...assetListItem,
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
  }
  return data
})

// watch(walletList, (val) => {
//   console.log('walletList', JSON.parse(JSON.stringify(val)))
// })
</script>
