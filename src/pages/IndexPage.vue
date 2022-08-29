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
            v-for="nft in walletList"
            :key="`nft-${nft.tx_hash}`"
            expand-separator
            :label="nft.asset_list[0].policy_id"
            default-opened
          >
            <q-separator />
            <q-expansion-item
              v-for="asset in nft.asset_list"
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
          </q-expansion-item>
        </q-list>
      </q-scroll-area>
    </div>
  </q-page>
</template>

<script setup async>
import { wallets } from 'components/models'
// import { storeToRefs } from 'pinia'
import { computed, onBeforeUpdate, onUpdated, onActivated, onBeforeMount, onBeforeUnmount, onDeactivated, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTransactionStore } from 'stores/transactions'
import { useWalletsStore } from 'stores/wallets'

const route = useRoute()
// const data = mockupData[0];
const searchText = ref('')
const store = useTransactionStore()
const walletsStore = await useWalletsStore()
// const { wallets } = useWalletsStore()
const walletList = computed(() => {
  const data = []
  // const { wallets } = storeToRefs(store)
  if (wallets.length !== 0) {
    for (let i = 0; i < wallets.length; i++) {
      if (
        route.params.walletnum === 'all' ||
        (route.params.walletnum &&
          wallets[i].id === wallets[Number(route.params.walletnum) - 1].id)
      ) {
        wallets[i].utxo_set
          .filter(
            (x) =>
              searchText.value === '' ||
              x.asset_list[0].asset_name
                .toLowerCase()
                .includes(searchText.value.toLowerCase()) ||
              x.asset_list[0].policy_id
                .toLowerCase()
                .includes(searchText.value.toLowerCase())
          )
        // eslint-disable-next-line array-callback-return
          .map((x) => {
            data.push({
              ...x,
              asset_list: x.asset_list.map((y) => ({
                ...y,
                realName: y.data.name,
                walletName: wallets[i].name
              }))
            })
          })
      }
    }
  }
  console.log('computed', walletsStore.wallets)
  return data
})

// const walletList = reactive(walletListFunction())

// onBeforeMount(walletList = walletListFunction())
onMounted(async () => {
  console.log('onMounted', walletsStore.wallets)
})
onUpdated(async () => {
  console.log('onUpdated', walletsStore.wallets)
})
onUnmounted(async () => {
  console.log('onUnmounted', walletsStore.wallets)
})
onBeforeMount(async () => {
  console.log('onBeforeMount', walletsStore.wallets)
})
onBeforeUpdate(async () => {
  console.log('onBeforeUpdate', walletsStore.wallets)
})
onBeforeUnmount(async () => {
  console.log('onBeforeUnmount', walletsStore.wallets)
})
onActivated(async () => {
  console.log('onActivated', walletsStore.wallets)
})
onDeactivated(async () => {
  console.log('onDeactivated', walletsStore.wallets)
})
</script>
