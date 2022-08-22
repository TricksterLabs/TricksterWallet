<template>
  <q-list separator>
    <q-item class="q-pa-none bg-green-02" tag="a" :href="`/#/all/${classify}`">
      <q-avatar font-size="16px" class="q-mr-sm q-my-sm wallet-num wallet-all"
        >ALL</q-avatar
      >
      <q-separator vertical></q-separator>
      <q-item-section class="q-pa-sm">
        <q-item-label class="justify-between flex q-px-md">
          <span>15</span>
          <span>$20</span>
        </q-item-label>
        <q-item-label class="text-center"
          >Assets: {{ wallets.length }}</q-item-label
        >
      </q-item-section>
    </q-item>

    <q-item>
      <q-input v-model="searchText" borderless label="Search.." dense>
        <template v-slot:append>
          <q-icon
            name="close"
            @click="searchText = ''"
            class="cursor-pointer"
          />
        </template>
      </q-input>
    </q-item>
  </q-list>
  <q-separator></q-separator>
  <q-scroll-area class="fit">
    <q-list separator>
      <template v-for="(wallet, index) in wallets" :key="wallet.address">
        <WalletItem
          v-if="
            wallet.name.toLowerCase().includes(searchText.toLowerCase()) ||
            searchText === ''
          "
          :num="index + 1"
          :classify="classify"
          :currentNum="walletNum"
          v-bind="wallet"
        />
      </template>
      <q-separator></q-separator>
    </q-list>
  </q-scroll-area>
  <q-separator />
  <q-item
    clickable
    class="flex bg-negative text-white"
    style="min-height: 50px"
  >
    <q-item-section class="text-center">WALLET MANAGEMENT</q-item-section>
  </q-item>
</template>

<script setup>
import WalletItem from 'components/WalletItem.vue'
import { ref } from 'vue'
import { wallets } from './models'

const searchText = ref('')

// eslint-disable-next-line vue/valid-define-props
withDefaults(defineProps(), {
  walletNum: '1',
  classify: 'assets'
})
</script>
