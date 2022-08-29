<template>
  <q-list
    bordered
    separator
    class="full-height flex column no-wrap"
  >
    <q-item
      class="flex justify-center items-center"
      style="min-height: 63px"
    >
      <q-item-label header>
        TRANSACTION
      </q-item-label>
    </q-item>
    <q-item
      class="q-pa-none"
      style="min-height: 57px"
    >
      <q-tabs
        v-model="tab"
        no-caps
        outside-arrows
        mobile-arrows
        class="full-width"
      >
        <q-tab
          name="standard"
          label="Standard"
        />
        <q-tab
          name="one2many"
          label="One2Many"
        />
        <q-tab
          name="many2one"
          label="Many2One"
        />
      </q-tabs>
    </q-item>

    <q-item class="full-height q-pa-none">
      <q-scroll-area class="fit">
        <q-list bordered>
          <q-expansion-item
            v-for="(nfts, i) in store.transactions"
            :key="`transaction-${nfts[0].walletName}`"
            expand-separator
            class="rounded-borders"
            dense
            group="transactions"
            v-model="selectedWallet[i]"
          >
            <template #header>
              <q-item-section>
                {{ nfts[0].walletName }}
              </q-item-section>

              <q-item-section
                caption
                side
              >
                ADA: {{ totalAmounts[i] }}
              </q-item-section>
            </template>
            <q-item
              v-for="nft in nfts"
              :key="nft.asset_name"
              class="row"
            >
              <q-item-section avatar>
                <q-avatar>1</q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="wallet-text">
                  {{
                    nft.asset_name
                  }}
                </q-item-label>
                <q-item-label
                  caption
                  class="wallet-text"
                >
                  {{
                    nft.policy_id
                  }}
                </q-item-label>
              </q-item-section>

              <q-item-section
                class="cursor-pointer"
                side
                @click="store.removeSelect(nft.asset_name)"
              >
                X
              </q-item-section>
            </q-item>
          </q-expansion-item>
        </q-list>
      </q-scroll-area>
    </q-item>
    <q-item
      class="q-pa-none"
      v-if="selectedWallet.includes(true)"
    >
      <q-item-section
        class="col-6 bordered q-pa-md flex column no-wrap"
        style="margin: 0"
      >
        <q-item-label caption>
          <strong>ADA</strong> to send
        </q-item-label>
        <input
          type="number"
          v-model.number="adaAmounts[selectedNum]"
          class="number-input"
        >
      </q-item-section>
      <q-item-section
        class="col-3 bordered q-pa-md flex column no-wrap"
        style="margin: 0"
      >
        <q-item-label caption>
          Fee
        </q-item-label>
        <q-item-label>{{ feeAmount }}</q-item-label>
      </q-item-section>
      <q-item-section
        class="col-3 bordered q-pa-md flex column no-wrap"
        style="margin: 0"
      >
        <q-item-label caption>
          Total
        </q-item-label>
        <q-item-label>{{ totalAmounts[selectedNum] }}</q-item-label>
      </q-item-section>
    </q-item>
    <q-item
      class="column"
      style="min-height: auto"
    >
      Receiving address:
      <q-input
        type="textarea"
        v-model="receivingAddress"
        dense
        input-style="padding: 0;"
        autogrow
        borderless
      />
    </q-item>
    <q-btn
      size="40px"
      color="primary"
      :disable="receivingAddress === ''"
    >
      SUBMIT
    </q-btn>
  </q-list>
</template>

<script setup>
import { useTransactionStore } from 'src/stores/transactions'
import { computed, ref } from 'vue'

const store = useTransactionStore()
const tab = ref('standard')
const receivingAddress = ref('')
const selectedWallet = ref(Array(store.transactions.length).fill(false))
const selectedNum = computed(() => {
  return selectedWallet.value.indexOf(true)
})
const adaAmounts = ref(Array(store.transactions.length).fill(0))
const feeAmount = computed(() => 1.45)
const totalAmounts = computed(() => {
  return adaAmounts.value.map(
    (x, i) => (Number(adaAmounts.value[i]) || 0) + Number(feeAmount.value)
  )
})
</script>
