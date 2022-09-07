<template>
  <q-item
    clickable
    tag="a"
    :href="`/#/${props.num}/${props.classify}`"
    class="q-pa-none flex items-center q-pr-none"
    :class="
      currentNum === props.num || props.currentNum === 'all'
        ? 'wallet-hover'
        : ''
    "
  >
    <q-badge
      class="absolute-top-left q-mt-xs q-ml-xs"
      outline
      square
      :style="{'color': color}"
    >
      {{ props.num }}
    </q-badge>
    <!-- <q-separator vertical></q-separator> -->
    <q-item-section class="q-pa-sm q-pt-md">
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
<!--      <q-item-label-->
<!--        caption-->
<!--        class="flex justify-between q-px-md"-->
<!--      >-->
<!--        &lt;!&ndash; <span>{{ props.qty }}</span> &ndash;&gt;-->
<!--        &lt;!&ndash; <span>${{ props.usd }}</span> &ndash;&gt;-->
<!--      </q-item-label>-->
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
