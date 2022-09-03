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
          <template #append>
            <q-icon
              name="close"
              @click="searchText = ''"
              class="cursor-pointer"
            />
          </template>
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
    <div class="fit-main">
      <q-scroll-area class="fit">
        <q-list bordered>
          <q-expansion-item
            v-for="(nft, policyId) in walletList"
            :key="policyId"
            expand-separator
            :label="policyId"
            default-opened
          >
            <q-separator />
            <template
              v-for="item in nft"
              :key="item.id"
            >
              <q-expansion-item
                v-for="asset in item.asset_list"
                :key="`asset-${asset.asset_name}`"
                expand-separator
              >
                <template #header>
                  <q-checkbox
                    v-model="store.selections"
                    :val="asset"
                  />
                  <q-item-section avatar>
                    <q-avatar>1</q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>{{ asset.realName }}</q-item-label>
                    <q-item-label caption>
                      {{ asset.asset_name }}
                    </q-item-label>
                    <q-item-label caption>
                      {{ asset.walletName }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    {{ asset.quantity }}x
                  </q-item-section>
                </template>
                <q-card>
                  <q-card-section class="row">
                    <div class="col-8">
                      <h6 class="q-mt-none q-mb-md">
                        Properties:
                      </h6>
                      <p>
                        Asset Name: <span>{{ asset.asset_name }}</span>
                      </p>
                      <p>
                        Policy Id: <span>{{ asset.policy_id }}</span>
                      </p>
                      <p>Fingerprint: <span>fg43f43</span></p>
                      <p>Metadata Type: <span>721</span></p>
                      <p>
                        Sources Type:
                        <span>{{
                          asset.data.mediaType ?? 'image/jpeg'
                        }}</span>
                      </p>
                      <p>
                        Source Link:
                        <span>{{ asset.data.image }}</span>
                      </p>
                      <p>
                        Quantity: <span>{{ asset.quantity }}</span>
                      </p>
                    </div>
                    <div class="col-4">
                      <h6 class="q-mt-none q-mb-md">
                        Metadata:
                      </h6>
                      <p>Legs: <span>Yes</span></p>
                      <p>Head: <span>Yes</span></p>
                      <p>Hands: <span>Yes</span></p>
                      <p>Body: <span>Yes</span></p>
                      <p>Eyes: <span>Yes</span></p>
                      <p>Mouth: <span>Yes</span></p>
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
import { useRoute } from 'vue-router'
import { useTransactionStore } from 'stores/transactions'
import { useWalletsStore } from 'stores/wallets'

const route = useRoute()
const searchText = ref('')
const store = useTransactionStore()
// const walletStore = useWalletsStore()
const { wallets } = storeToRefs(useWalletsStore())

const walletList = computed(() => {
  const data = {}
  const walletsRefs = JSON.parse(JSON.stringify(wallets.value))
  // console.log('walletRefs', walletsRefs)
  const walletnum = route.params.walletnum
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
