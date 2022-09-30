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
            <div class="q-px-md">
              <q-chip
                outline
                square
                dense
                color="cyan-7"
                text-color="white"
                v-if="projectMapping[policyId]['asset_holders']"
              >
                Asset Holder - {{ projectMapping[policyId]['asset_holders'] }}
              </q-chip>

              <q-chip
                outline
                square
                dense
                color="primary"
                text-color="white"
                v-if="projectMapping[policyId]['asset_minted']"
              >
                Asset Minted - {{ projectMapping[policyId]['asset_minted'] }}
              </q-chip>
              <q-chip
                outline
                square
                dense
                color="positive"
                text-color="white"
                v-if="projectMapping[policyId]['floor_price']"
              >
                Floor Price - {{ parseInt(projectMapping[policyId]['floor_price'] / 1000000) }}
              </q-chip>
              <q-chip
                outline
                square
                dense
                color="orange"
                text-color="white"
                v-if="projectMapping[policyId]['total_volume']"
              >
                Total Volume - {{ parseInt(projectMapping[policyId]['total_volume'] / 1000000) }}
              </q-chip>
              <q-chip
                outline
                square
                dense
                color="light-blue-10"
                text-color="white"
                v-if="projectMapping[policyId]['name']"
              >
                Name - {{ projectMapping[policyId]['name'] }}
              </q-chip>
            </div>
            <template
              v-for="(item, id) in nft"
              :key="id"
            >
              <q-expansion-item
                v-for="(asset, id2) in item"
                :key="`asset-${id2}`"
                class="expansion-border q-ma-sm"
                :expand-separator="false"
              >
                <template #header>
                  <q-checkbox
                    :model-value="JSON.stringify(store.selections).indexOf(JSON.stringify(asset))>=0?true:false"
                    @update:model-value="removeFromStore(asset, asset.walletId)"
                  />
                  <q-item-section avatar>
                    <q-avatar>
                      <img :src="asset.hasOwnProperty('data') && asset.data.hasOwnProperty('last_metadata') && asset.data.last_metadata.hasOwnProperty('image') && asset.data.last_metadata.image?'https://nftstorage.link/ipfs/'+asset.data.last_metadata.image.split('//')[1]:'https://cdn.quasar.dev/img/avatar5.jpg'">
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-weight-bold">
                      {{ asset.asset_name.match(/.{1,2}/g).reduce((acc, char) => acc + String.fromCharCode(parseInt(char, 16)), '').toUpperCase() }}
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
                        v-if="asset.hasOwnProperty('data') && asset.data.hasOwnProperty('statistical_rank') && asset.data.statistical_rank"
                      >
                        Statistical Rank - {{ asset.data.statistical_rank }}
                      </q-chip>
                      <q-chip
                        outline
                        square
                        dense
                        color="light-blue-8"
                        text-color="white"
                        v-if="asset.hasOwnProperty('data') && asset.data.hasOwnProperty('rarity_rank') && asset.data.rarity_rank"
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
                            v-if="(data!='traits' && data!='last_metadata') && asset.data.hasOwnProperty(data)"
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
                      <template
                        v-if="asset.hasOwnProperty('data') && asset.data.hasOwnProperty('traits')"
                      >
                        <template
                          :key="data"
                          v-for="data in Object.keys(asset.data.traits)"
                        >
                          <q-input
                            v-if="asset.data.traits.hasOwnProperty(data)"
                            dense
                            :model-value="asset.data.traits[data]"
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

                      <div class="col-12">
                        <q-btn
                          label="Show Info"
                          class="float-right text-capitalize"
                          outline
                          @click="setData(asset)"
                        />
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </template>

            <!-- <template v-for="(asset) in assets">
              <template v-if="asset.id===policyId">
                <template
                  v-for="(asset_item, asset_id) in asset.asset_name"
                  :key="asset_id"
                >
                  <q-expansion-item
                    class="expansion-border q-ma-sm"
                    :expand-separator="false"
                  >
                    <template #header>
                      <q-checkbox
                        :model-value="JSON.stringify(store.selections).indexOf(JSON.stringify(asset_item))>=0?true:false"
                        @update:model-value="removeFromStore(asset_item)"
                      />
                      <q-item-section avatar>
                        <q-avatar>
                          <img
                            :src="asset_item.hasOwnProperty('last_metadata') && asset_item.last_metadata.hasOwnProperty('image') && asset_item.last_metadata.image?'https://nftstorage.link/ipfs/'+asset_item.last_metadata.image.split('//')[1]:'https://cdn.quasar.dev/img/avatar5.jpg'"
                          >
                        </q-avatar>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label
                          class="text-weight-bold"
                          v-if="asset_item.hasOwnProperty('last_metadata') && asset_item.last_metadata.hasOwnProperty('name')"
                        >
                          {{ asset_item.last_metadata.name }}
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
                            v-if="asset_item.hasOwnProperty('statistical_rank') && asset_item.statistical_rank"
                          >
                            Statistical Rank - {{ asset_item.statistical_rank }}
                          </q-chip>
                          <q-chip
                            outline
                            square
                            dense
                            color="light-blue-8"
                            text-color="white"
                            v-if="asset_item.hasOwnProperty('rarity_rank') && asset_item.rarity_rank"
                          >
                            Rarity Rank - {{ asset_item.rarity_rank }}
                          </q-chip>
                        </q-item-label>
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
                          <template v-if="asset_item.hasOwnProperty('last_metadata')">
                            <template
                              :key="data"
                              v-for="data in Object.keys(asset_item.last_metadata)"
                            >
                              <q-input
                                v-if="data!='files' && asset_item.last_metadata.hasOwnProperty(data)"
                                dense
                                :model-value="asset_item.last_metadata[data]"
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
              </template>
            </template> -->
          </q-expansion-item>
        </q-list>
      </q-scroll-area>
    </div>

    <q-dialog
      v-model="detailView"
      persistent
    >
      <q-card style="min-width: 1250px">
        <q-card-section class="col-12 q-pa-sm">
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img
                  :src="selectedAsset.hasOwnProperty('data') && selectedAsset.data.hasOwnProperty('last_metadata') && selectedAsset.data.last_metadata.hasOwnProperty('image') && selectedAsset.data.last_metadata.image?'https://nftstorage.link/ipfs/'+selectedAsset.data.last_metadata.image.split('//')[1]:'https://cdn.quasar.dev/img/avatar5.jpg'"
                >
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-bold">
                {{
                  selectedAsset.asset_name.match(/.{1,2}/g).reduce((acc, char) => acc + String.fromCharCode(parseInt(char, 16)), '').toUpperCase()
                }}
              </q-item-label>
              <q-item-label
                caption
                class="text-weight-bold"
              >
                {{ selectedAsset.walletName }} / {{
                  $q.screen.gt.md ? selectedAsset.asset_name : shortenPolicy(selectedAsset.asset_name)
                }}
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
                  v-if="selectedAsset.hasOwnProperty('data') && selectedAsset.data.hasOwnProperty('statistical_rank') && selectedAsset.data.statistical_rank"
                >
                  Statistical Rank - {{ selectedAsset.data.statistical_rank }}
                </q-chip>
                <q-chip
                  outline
                  square
                  dense
                  color="light-blue-8"
                  text-color="white"
                  v-if="selectedAsset.hasOwnProperty('data') && selectedAsset.data.hasOwnProperty('rarity_rank') && selectedAsset.data.rarity_rank"
                >
                  Rarity Rank - {{ selectedAsset.data.rarity_rank }}
                </q-chip>
                <q-chip
                  v-if="!$q.screen.gt.md"
                  outline
                  square
                  dense
                  color="red"
                  text-color="white"
                >
                  {{ selectedAsset.quantity }}x
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
              <q-btn
                icon="close"
                @click="removeData"
                flat
                round
                dense
              />
              <q-chip
                outline
                square
                dense
                color="red"
                text-color="white"
              >
                {{ selectedAsset.quantity }}x
              </q-chip>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-separator />
        <q-card-section class="row q-pa-sm">
          <!--          <q-expansion-item-->
          <!--            :expand-separator="false"-->
          <!--            label="Last Metadata"-->
          <!--            default-opened-->
          <!--            group="meta"-->
          <!--            class="expansion-border col-12 full-width q-ma-sm"-->
          <!--            :header-class="$q.screen.gt.md?'expansion-border-header text-center':'expansion-border-header'"-->
          <!--          >-->
          <div class="col-12">
            <q-toggle
              v-model="jsonView"
              label="Json View"
              class="float-right"
            />
          </div>
          <div
            class="col-12"
            v-if="jsonView"
          >
            <json-viewer
              :value="selectedAsset.data.last_metadata"
              :expand-depth="5"
              copyable
              :class="$q.dark.isActive?'bg-dark':'bg-grey-2'"
              theme="dark"
              sort
            />
          </div>
          <template
            v-if="!jsonView && selectedAsset.hasOwnProperty('data') && selectedAsset.data.hasOwnProperty('last_metadata')"
          >
            <template
              :key="data"
              v-for="data in Object.keys(selectedAsset.data.last_metadata)"
            >
              <q-input
                v-if="data!='attributes' && selectedAsset.data.last_metadata.hasOwnProperty(data)"
                dense
                :model-value="selectedAsset.data.last_metadata[data]"
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
          <template
            v-if="!jsonView && selectedAsset.hasOwnProperty('data') && selectedAsset.data.hasOwnProperty('last_metadata') && selectedAsset.data.last_metadata.hasOwnProperty('attributes')"
          >
            <template
              :key="attributes_data"
              v-for="attributes_data in Object.keys(selectedAsset.data.last_metadata.attributes)"
            >
              <q-input
                dense
                :model-value="attributes_data === 'attributes'?selectedAsset.data.last_metadata.attributes[attributes_data].join(','):selectedAsset.data.last_metadata.attributes[attributes_data]"
                input-class=""
                :class="$q.screen.gt.md?'col-6':'col-12'"
                borderless
                readonly
                :label-slot="true"
              >
                <template #label>
                  <span class="text-capitalize">
                    {{ attributes_data.split('_').join(' ') }}
                  </span>
                </template>
              </q-input>
            </template>
          </template>
          <!--          </q-expansion-item>-->
          <!--          <q-expansion-item-->
          <!--            :expand-separator="false"-->
          <!--            label="Traits"-->
          <!--            group="meta"-->
          <!--            class="expansion-border col-12 full-width q-ma-sm"-->
          <!--            :header-class="$q.screen.gt.md?'expansion-border-header text-center':'expansion-border-header'"-->
          <!--          >-->
          <!--            <div class="row q-pa-sm">-->
          <!--              <template-->
          <!--                v-if="selectedAsset.hasOwnProperty('data') && selectedAsset.data.hasOwnProperty('traits')">-->
          <!--                <template-->
          <!--                  :key="data"-->
          <!--                  v-for="data in Object.keys(selectedAsset.data.traits)"-->
          <!--                >-->
          <!--                  <q-input-->
          <!--                    v-if="selectedAsset.data.traits.hasOwnProperty(data)"-->
          <!--                    dense-->
          <!--                    :model-value="selectedAsset.data.traits[data]"-->
          <!--                    input-class=""-->
          <!--                    :class="$q.screen.gt.md?'col-6':'col-12'"-->
          <!--                    borderless-->
          <!--                    readonly-->
          <!--                    :label-slot="true"-->
          <!--                  >-->
          <!--                    <template #label>-->
          <!--                    <span class="text-capitalize">-->
          <!--                      {{ data.split('_').join(' ') }}-->
          <!--                    </span>-->
          <!--                    </template>-->
          <!--                  </q-input>-->
          <!--                </template>-->
          <!--              </template>-->
          <!--            </div>-->
          <!--          </q-expansion-item>-->
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTransactionStore } from 'stores/transactions'
import { useWalletsStore } from 'stores/wallets'
import { shortenPolicy } from 'src/utils'
import JsonViewer from 'vue-json-viewer'

const searchText = ref('')
const selectedAsset = ref({})
const detailView = ref(false)
const jsonView = ref(false)

const store = useTransactionStore()
// const walletStore = useWalletsStore()
const { wallets, assets } = storeToRefs(useWalletsStore())

// console.log('test', assetsTemp)

// const assetsList = computed(() => {
//   const assetsRefs = JSON.parse(JSON.stringify(assets.value))
//   const data = {}
//   for (let i = 0; i < assetsRefs.length; i++) {
//     for (let j = 0; j < [assetsRefs[i].asset_name].length; j++) {
//       data[assetsRefs[i].id] =
//          [assetsRefs[i].asset_name][j]
//     }
//   }
//   return data
// })

// console.log('assetsList', (assetsList.value)['8d84d3b86b2c9510fea6f2f671872a38a2ffeca270bbc71f95c84420']['46757473616c436f757274303331'])

const setData = (data) => {
  selectedAsset.value = data
  detailView.value = true
}

const removeData = () => {
  selectedAsset.value = {}
  detailView.value = false
}

const projectMapping = computed(() => {
  const assetsRefs = JSON.parse(JSON.stringify(assets.value))
  const tempMapping = {}
  for (let i = 0; i < assetsRefs.length; i++) {
    tempMapping[assetsRefs[i].id] = assetsRefs[i].project
  }
  return tempMapping
})

const walletList = computed(() => {
  const assetsRefs = JSON.parse(JSON.stringify(assets.value))
  const assetsList = {}
  for (let i = 0; i < assetsRefs.length; i++) {
    for (let j = 0; j < [assetsRefs[i].asset_name].length; j++) {
      assetsList[assetsRefs[i].id] = [assetsRefs[i].asset_name][j]
    }
    // console.log(assetsRefs[i]['id'])
  }
  const data = {}
  const walletsRefs = JSON.parse(JSON.stringify(wallets.value))
  // console.log('walletRefs', walletsRefs)
  const walletnum = store.walletNum

  if (walletsRefs && walletsRefs.length !== 0) {
    for (let i = 0; i < walletsRefs.length; i++) {
      if (walletnum === 'all' || (walletnum && walletsRefs[i].id === Number(walletnum))) {
        // console.log('refs', walletsRefs[i].id)
        // console.log('refs', walletsRefs[Number(walletnum) - 1])
        // console.log('refs', walletsRefs[i].id)
        const filteredUTXOSet = walletsRefs[i].utxo_set?.map(function (item) {
          item.asset_list = item.asset_list.filter(function (asset) {
            return searchText.value === '' || (asset.policy_id.toLowerCase().indexOf(searchText.value.toLowerCase()) >= 0) ||
                   (asset.asset_name.match(/.{1,2}/g).reduce((acc, char) => acc + String.fromCharCode(parseInt(char, 16)), '').toLowerCase().indexOf(searchText.value.toLowerCase()) >= 0)
          })
          return item
        })
        filteredUTXOSet.forEach((item) => {
          for (let y = 0; y < item.asset_list.length; y++) {
            if (data[item.asset_list[y].policy_id]) {
              if (data[item.asset_list[y].policy_id][item.asset_list[y].asset_name]) {
                if (data[item.asset_list[y].policy_id][item.asset_list[y].asset_name][walletsRefs[i].id]) {
                  data[item.asset_list[y].policy_id][item.asset_list[y].asset_name][walletsRefs[i].id].quantity = (parseInt(data[item.asset_list[y].policy_id][item.asset_list[y].asset_name][walletsRefs[i].id].quantity) + parseInt(item.asset_list[y].quantity)).toString()
                } else {
                  if (assetsList && assetsList[item.asset_list[y].policy_id] && assetsList[item.asset_list[y].policy_id][item.asset_list[y].asset_name]) {
                    data[item.asset_list[y].policy_id][item.asset_list[y].asset_name][walletsRefs[i].id] = {
                      ...item.asset_list[y],
                      data: assetsList[item.asset_list[y].policy_id][item.asset_list[y].asset_name],
                      walletId: walletsRefs[i].id,
                      walletName: walletsRefs[i].name,
                      balance: walletsRefs[i].balance
                    }
                  } else {
                    data[item.asset_list[y].policy_id][item.asset_list[y].asset_name][walletsRefs[i].id] = {
                      ...item.asset_list[y],
                      walletId: walletsRefs[i].id,
                      walletName: walletsRefs[i].name,
                      balance: walletsRefs[i].balance
                    }
                  }
                }
              } else {
                if (assetsList && assetsList[item.asset_list[y].policy_id] && assetsList[item.asset_list[y].policy_id][item.asset_list[y].asset_name]) {
                  data[item.asset_list[y].policy_id][item.asset_list[y].asset_name] = {
                    [walletsRefs[i].id]: {
                      ...item.asset_list[y],
                      data: assetsList[item.asset_list[y].policy_id][item.asset_list[y].asset_name],
                      walletId: walletsRefs[i].id,
                      walletName: walletsRefs[i].name,
                      balance: walletsRefs[i].balance
                    }
                  }
                } else {
                  data[item.asset_list[y].policy_id][item.asset_list[y].asset_name] = {
                    [walletsRefs[i].id]: {
                      ...item.asset_list[y],
                      walletId: walletsRefs[i].id,
                      walletName: walletsRefs[i].name,
                      balance: walletsRefs[i].balance
                    }
                  }
                }
              }
            } else {
              if (assetsList && assetsList[item.asset_list[y].policy_id] && assetsList[item.asset_list[y].policy_id][item.asset_list[y].asset_name]) {
                data[item.asset_list[y].policy_id] = {
                  [item.asset_list[y].asset_name]: {
                    [walletsRefs[i].id]: {
                      ...item.asset_list[y],
                      data: assetsList[item.asset_list[y].policy_id][item.asset_list[y].asset_name],
                      walletId: walletsRefs[i].id,
                      walletName: walletsRefs[i].name,
                      balance: walletsRefs[i].balance
                    }
                  }
                }
              } else {
                data[item.asset_list[y].policy_id] = {
                  [item.asset_list[y].asset_name]: {
                    [walletsRefs[i].id]: {
                      ...item.asset_list[y],
                      walletId: walletsRefs[i].id,
                      walletName: walletsRefs[i].name,
                      balance: walletsRefs[i].balance
                    }
                  }
                }
              }
            }
          }
        })
      }
    }
  }
  // console.log('data', data)
  return data
})

const removeFromStore = (asset, id) => {
  let SelectedIndex = null
  // console.log(store.selections)
  store.selections.filter(function (item, index) {
    if (JSON.stringify(asset) === JSON.stringify(item)) {
      SelectedIndex = index
    }
    return item
  })
  if (SelectedIndex != null) {
    store.selections.splice(SelectedIndex, 1)
    // console.log(asset.asset_name)
    store.removeSelect(asset.asset_name, id)
  } else {
    store.selections.push(asset)
  }
}
// watch(walletList, (val) => {
//   console.log('walletList', JSON.parse(JSON.stringify(val)))
// })
</script>
