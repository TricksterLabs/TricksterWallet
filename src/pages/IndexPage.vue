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
          <template v-slot:append>
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
    <q-separator></q-separator>
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
            <q-separator></q-separator>
            <q-expansion-item
              v-for="asset in nft.asset_list"
              :key="`asset-${asset.asset_name}`"
              expand-separator
            >
              <template v-slot:header>
                <q-checkbox v-model="store.selections" :val="asset" />
                <q-item-section avatar>
                  <q-avatar>1</q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ asset.realName }}</q-item-label>
                  <q-item-label caption>{{ asset.asset_name }}</q-item-label>
                  <q-item-label caption>{{ asset.walletName }}</q-item-label>
                </q-item-section>

                <q-item-section side> {{ asset.quantity }}x </q-item-section>
              </template>
              <q-card>
                <q-card-section class="row">
                  <div class="col-8">
                    <h6 class="q-mt-none q-mb-md">Properties:</h6>
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
                        asset.data.last_metadata.mediaType ?? 'image/jpeg'
                      }}</span>
                    </p>
                    <p>
                      Source Link:
                      <span>{{ asset.data.last_metadata.image }}</span>
                    </p>
                    <p>
                      Quantity: <span>{{ asset.quantity }}</span>
                    </p>
                  </div>
                  <div class="col-4">
                    <h6 class="q-mt-none q-mb-md">Metadata:</h6>
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

<script setup lang="ts">
import { mockupData, wallets } from 'components/models'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTransactionStore } from 'stores/transactions'

const route = useRoute()
// const data = mockupData[0];
const searchText = ref('')
const store = useTransactionStore()
const walletList = computed(() => {
  const data = []
  for (let i = 0; i < mockupData.length; i++) {
    if (
      route.params.walletnum === 'all' ||
      (route.params.walletnum &&
        mockupData[i].name === wallets[Number(route.params.walletnum) - 1].name)
    ) {
      mockupData[i].utxo_set
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
              realName: y.data.last_metadata.name,
              walletName: mockupData[i].name
            }))
          })
        })
    }
  }
  // console.log(data);
  return data
})
</script>
