<template>
  <q-toolbar class="q-pa-none">
    <q-scroll-area style="height: 64px; width: 100%">
      <q-list
        separator
        class="flex items-center full-width no-wrap"
      >
        <template
          v-for="nav in navs"
          :key="nav"
        >
          <q-btn
            square
            type="a"
            :href="`/#/${props.walletNum}/${nav.toLowerCase()}`"
            class="flex text-capitalize text-weight-bold justify-center items-center full-width"
            style="height: 64px"
          >
            {{ nav.toLowerCase() }}
          </q-btn>
          <q-separator vertical />
        </template>
        <q-btn
          color="negative"
          square
          outline
          type="a"
          class="flex justify-center text-weight-bold text-capitalize items-center full-width"
          style="height: 64px"
        >
          Settings
        </q-btn>
      </q-list>
    </q-scroll-area>
  </q-toolbar>
</template>

<script setup>
const navs = ['ASSETS', 'MARKET', 'TRANSACTION', 'STAKING', 'VOTING']
const props = defineProps({
  walletNum: String
})
</script>
