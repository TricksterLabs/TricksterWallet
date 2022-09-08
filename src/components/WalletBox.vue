<template>
  <q-list separator>
    <!--    <q-item-->
    <!--      style="border: 1px #03a9f4 solid;border-radius:5px"-->
    <!--      class="q-mt-sm q-mx-xs"-->
    <!--      clickable-->
    <!--      @click="store.WalletNumData('all', 'assets')"-->
    <!--    >-->
    <!--      <q-badge-->
    <!--        class="absolute-top-left q-mt-xs q-ml-xs"-->
    <!--        square-->
    <!--        color="blue"-->
    <!--      >-->
    <!--        All-->
    <!--      </q-badge>-->
    <!--      <q-item-section class="q-pt-ms">-->
    <!--        <q-item-label class="justify-between text-weight-bolder flex q-px-md">-->
    <!--          <span>15</span>-->
    <!--          <span>$20</span>-->
    <!--        </q-item-label>-->
    <!--&lt;!&ndash;        <q-item-label class="text-center">&ndash;&gt;-->
    <!--&lt;!&ndash;          &lt;!&ndash; Assets: {{ store.wallets }} &ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;        </q-item-label>&ndash;&gt;-->
    <!--      </q-item-section>-->
    <!--    </q-item>-->

    <q-item
      class="q-pa-none bg-cyan-5 text-white"
      tag="a"
      clickable
      @click="store.WalletNumData('all', 'assets')"
    >
      <q-avatar
        font-size="16px"
        class="q-mr-sm q-my-sm wallet-num wallet-all"
      >
        ALL
      </q-avatar>
      <q-separator vertical />
      <q-item-section class="q-pt-ms">
        <q-item-label class="justify-between text-weight-bolder flex q-px-md">
          <span>15</span>
          <span>$20</span>
        </q-item-label>
        <q-item-label class="text-center">
          <!-- Assets: {{ store.wallets }} -->
        </q-item-label>
        <!--        <q-item-label class="text-center">-->
        <!--          &lt;!&ndash; Assets: {{ store.wallets }} &ndash;&gt;-->
        <!--        </q-item-label>-->
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
    <q-list
      separator
      v-if="wallets.length>0"
    >
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
          :classify="store.classify"
          :current-num="store.walletNum"
          :address="wallet.baseAddressExternal[0]"
          :name="wallet.name"
          :stack-address="wallet.stakeAddress"
          :balance="wallet.balance"
        />
      </template>
      <q-separator />
    </q-list>
  </q-scroll-area>
  <q-btn
    outline
    style="border-top: gray solid 0px !important;"
    color="negative"
    size="20px"
    class="q-ma-xs q-pb-sm"
    to="/manage"
  >
    MANAGE
  </q-btn>
</template>

<script setup>
import WalletItem from 'components/WalletItem.vue'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
// import { onBeforeUpdate, onUpdated, onActivated, onBeforeMount, onBeforeUnmount, onDeactivated, onMounted, onUnmounted, ref } from 'vue'

import { useWalletsStore } from 'stores/wallets'

import { useTransactionStore } from 'stores/transactions'
const store = useTransactionStore()

const { wallets } = storeToRefs(await useWalletsStore())

// console.log(JSON.parse(JSON.stringify(wallets.value)))

// const wallets = JSON.parse(JSON.stringify(await store.wallets))

const searchText = ref('')

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
