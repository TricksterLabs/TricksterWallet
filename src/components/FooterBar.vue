<template>
  <q-toolbar class="q-pa-none">
    <q-separator />
    <q-list class="footer-bar">
      <q-item>
        <q-item-section dense> Last Refresh: {{ lastTime }} </q-item-section>
      </q-item>
      <q-item>
        <q-item-section dense>Now: {{ currentTime }}</q-item-section>
      </q-item>
      <q-item>
        <q-toggle
          dense
          v-model="isLight"
          size="md"
          checked-icon="light_mode"
          color="grey"
          unchecked-icon="dark_mode"
          @click="$q.dark.toggle()"
        />
      </q-item>
      <q-item>
        <q-item-section dense>Version: 2.0.0 BETA</q-item-section>
      </q-item>
    </q-list>
  </q-toolbar>
</template>

<script setup>
import { onMounted, onUnmounted, onUpdated, ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const lastTime = ref(new Date(Date.now()).toLocaleString())
const currentTime = ref(new Date(Date.now()).toLocaleString())
const isLight = ref(!$q.dark.isActive)

let timer

onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date(Date.now()).toLocaleString()
  }, 1000)
  $q.dark.toggle()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
onUpdated(() => {
  lastTime.value = new Date(Date.now()).toLocaleString()
})
</script>
