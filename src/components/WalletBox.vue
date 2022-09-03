<template>
  <q-list separator>
    <q-item
      class="q-pa-none bg-green-02"
      tag="a"
      :href="`/#/all/${classify}`"
    >
      <q-avatar
        font-size="16px"
        class="q-mr-sm q-my-sm wallet-num wallet-all"
      >
        ALL
      </q-avatar>
      <q-separator vertical />
      <q-item-section class="q-pa-sm">
        <q-item-label class="justify-between flex q-px-md">
          <span>15</span>
          <span>$20</span>
        </q-item-label>
        <q-item-label class="text-center">
          <!-- Assets: {{ store.wallets }} -->
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-input
        v-model="searchText"
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
  </q-list>
  <q-separator />
  <q-scroll-area class="fit">
    <q-list separator>
      <template
        v-for="(wallet) in wallets"
        :key="wallet.baseAddressExternal[0]"
      >
        <WalletItem
          v-if="
            wallet.name.toLowerCase().includes(searchText.toLowerCase()) ||
              searchText === ''
          "
          :num="wallet.id"
          :classify="props.classify"
          :current-num="props.walletNum"
          :address="wallet.baseAddressExternal[0]"
        />
      </template>
      <q-separator />
    </q-list>
  </q-scroll-area>
  <q-separator />
  <q-item
    clickable
    class="flex bg-negative text-white"
    style="min-height: 50px"
  >
    <q-item-section class="text-center">
      WALLET MANAGEMENT
      <!-- {{ store.wallets }} -->
    </q-item-section>
  </q-item>
</template>

<script setup>
import WalletItem from 'components/WalletItem.vue'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
// import { onBeforeUpdate, onUpdated, onActivated, onBeforeMount, onBeforeUnmount, onDeactivated, onMounted, onUnmounted, ref } from 'vue'

import { useWalletsStore } from 'stores/wallets'

const { wallets } = storeToRefs(await useWalletsStore())

// console.log(JSON.parse(JSON.stringify(wallets.value)))

// const wallets = JSON.parse(JSON.stringify(await store.wallets))

const searchText = ref('')

const props = defineProps({
  walletNum: String,
  classify: String
})

// onMounted(() => {
//   console.log('onMounted2', store.wallets)
// })
// onUpdated(() => {
//   console.log('onUpdated2', store.wallets)
// })
// onUnmounted(() => {
//   console.log('onUnmounted2', store.wallets)
// })
// onBeforeMount(() => {
//   console.log('onBeforeMount2', store.wallets)
// })
// onBeforeUpdate(() => {
//   console.log('onBeforeUpdate2', store.wallets)
// })
// onBeforeUnmount(() => {
//   console.log('onBeforeUnmount2', store.wallets)
// })
// onActivated(() => {
//   console.log('onActivated2', store.wallets)
// })
// onDeactivated(() => {
//   console.log('onDeactivated2', store.wallets)
// })

</script>
