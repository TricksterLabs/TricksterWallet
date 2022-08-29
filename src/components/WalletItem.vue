<template>
  <q-item
    clickable
    tag="a"
    :href="`/#/${props.num}/${props.classify}`"
    class="q-pa-none flex items-center"
    :class="
      currentNum === props.num || props.currentNum === 'all'
        ? 'wallet-hover'
        : ''
    "
  >
    <q-avatar
      font-size="16px"
      class="q-mr-sm q-my-sm wallet-num"
      :style="{ background: color }"
    >
      {{ props.num }}
    </q-avatar>
    <!-- <q-separator vertical></q-separator> -->
    <q-item-section class="q-pa-sm">
      <q-item-label class="text-center">
        {{ props.name }}
      </q-item-label>
      <q-item-label
        caption
        class="text-center"
      >
        {{
          shortenAddress(props.address)
        }}
      </q-item-label>
      <q-item-label
        caption
        class="flex justify-between q-px-md"
      >
        <!-- <span>{{ props.qty }}</span> -->
        <!-- <span>${{ props.usd }}</span> -->
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { shortenAddress } from 'src/utils'
import randomColor from 'randomcolor/randomColor'
import { computed } from 'vue'
import { useQuasar } from 'quasar'

// eslint-disable-next-line vue/valid-define-props
const props = defineProps({
  address: String,
  // qty: Number,
  // usd: Number,
  num: Number,
  classify: String,
  currentNum: String
})
const $q = useQuasar()

const color = computed(() => {
  return randomColor({
    luminosity: $q.dark.isActive ? 'light' : 'dark',
    hue: 'rgb',
    alpha: 0.5
  })
})
</script>
