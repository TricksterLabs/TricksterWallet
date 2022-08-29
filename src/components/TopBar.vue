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
          <q-item
            tag="a"
            :href="`/#/${props.walletNum}/${nav.toLowerCase()}`"
            class="flex justify-center items-center full-width"
            style="height: 64px"
          >
            {{ nav }}
          </q-item>
          <q-separator vertical />
        </template>
        <q-item
          tag="a"
          class="flex justify-center items-center full-width bg-negative text-white"
          style="height: 64px"
        >
          SETTINGS
        </q-item>
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
