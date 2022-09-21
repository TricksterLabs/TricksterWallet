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
            :outline="route.path=='/'+nav.route?true:false"
            type="a"
            :to="`/${nav.route}`"
            class="flex text-capitalize text-weight-bold justify-center items-center full-width"
            style="height: 64px"
          >
            {{ nav.label.toLowerCase() }}
          </q-btn>
          <q-separator vertical />
        </template>
      </q-list>
    </q-scroll-area>
  </q-toolbar>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const navs = [
  {
    label: 'ASSETS',
    route: 'assets'
  }, {
    label: 'HISTORY',
    route: 'history'

  }, {
    label: 'MARKET',
    route: 'market'
  }, {
    label: 'STAKING',
    route: 'staking'
  },
  {
    label: 'VOTING',
    route: 'voting'
  }]
</script>
