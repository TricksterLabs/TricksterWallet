<template>
  <q-list separator>
    <q-item
      style="border: 1px #03a9f4 solid;border-radius:5px"
      class="q-mt-sm q-mx-xs"
      tag="a"
      :href="`/#/all/${classify}`"
    >
      <q-badge
        class="absolute-top-left q-mt-xs q-ml-xs"
        square
        color="blue"
      >
        All
      </q-badge>
      <q-item-section class="q-pt-ms">
        <q-item-label class="justify-between text-weight-bolder flex q-px-md">
          <span>15</span>
          <span>$20</span>
        </q-item-label>
<!--        <q-item-label class="text-center">-->
<!--          &lt;!&ndash; Assets: {{ store.wallets }} &ndash;&gt;-->
<!--        </q-item-label>-->
      </q-item-section>
    </q-item>

    <q-input
      v-model="searchText"
      class="full-width q-pa-xs"
      outlined
      dense
      label="Search.."
    >
      <template #append>
        <q-icon
          v-if="searchText"
          name="close"
          @click="searchText = ''"
          class="cursor-pointer"
        />
      </template>
    </q-input>
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
  <q-btn
    outline
    style="border-top: gray solid 0px !important;"
    color="negative"
    class="q-ma-xs q-pb-sm"
  >
    WALLET <br/> MANAGEMENT
  </q-btn>
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
