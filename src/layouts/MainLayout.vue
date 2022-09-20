<template>
  <q-layout view="lHr Lpr lFr">
    <q-header
      bordered
      class="bg-transparent text-black"
    >
      <Suspense>
        <template #default>
          <TopBar :wallet-num="walletNum" />
        </template>
        <template #fallback>
          Loading...
        </template>
      </Suspense>
    </q-header>

    <q-footer
      bordered
      style="height: 60px"
      class="bg-transparent text-black"
    >
      <Suspense>
        <template #default>
          <FooterBar />
        </template>
        <template #fallback>
          Loading...
        </template>
      </Suspense>
    </q-footer>

    <q-drawer
      v-model="leftDrawerOpen"
      :breakpoint="0"
      bordered
      :width="220"
      class="flex no-wrap column"
    >
      <Suspense>
        <template #default>
          <WalletBox
            :classify="classify"
            :wallet-num="walletNum"
          />
        </template>
        <template #fallback>
          Loading...
        </template>
      </Suspense>
    </q-drawer>

    <q-drawer
      side="right"
      v-model="rightDrawerOpen"
      :breakpoint="0"
      bordered
      :width="320"
    >
      <Suspense>
        <template #default>
          <TransactionBox />
        </template>
        <template #fallback>
          Loading...
        </template>
      </Suspense>
    </q-drawer>

    <q-page-container>
      <Suspense>
        <template #default>
          <router-view />
        </template>
        <template #fallback>
          Loading...
        </template>
      </Suspense>
    </q-page-container>
  </q-layout>

  <PasswordModal
    @passed="pass = true"
    v-if="!pass"
  />
</template>

<script setup>
import { ref } from 'vue'
import TopBar from '../components/TopBar.vue'
import TransactionBox from 'src/components/TransactionBox.vue'
import WalletBox from 'src/components/WalletBox.vue'
import FooterBar from 'src/components/FooterBar.vue'
import PasswordModal from 'src/components/PasswordModal.vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

$q.dark.set(true)
// import { date } from 'quasar';

const walletNum = ref('all')
const classify = ref('assets')
const pass = ref(false)

const leftDrawerOpen = ref(true)
const rightDrawerOpen = ref(true)

</script>
