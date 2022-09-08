<template>
  <q-item
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
      :style="{'color': color(props.address)}"
    >
      {{ props.num }}
    </q-badge>
    <!-- <q-separator vertical></q-separator> -->
    <q-item-section class="q-pa-sm">
      <div>
        <a
          style="text-decoration: none"
          @click="store.WalletNumData(props.num, props.classify)"
          class="cursor-pointer"
          :class="$q.dark.isActive?'text-white':'text-grey-8'"
        >
          <q-item-label class="text-center text-h6 text-weight-bold">
            {{ props.name }}
          </q-item-label>
          <q-item-label
            class="col-12 text-body2 text-center"
          >
            {{
              shortenAddress(props.address)
            }}
          </q-item-label>
          <q-item-label
            class="col-12text-body2 text-center"
          >
            {{
              shortenAddress(props.stackAddress)
            }}
          </q-item-label>
          <q-item-label class="text-body2 text-center">
            {{ (balance / 1000000).toFixed(2) }}
            {{ balance / 200 }}$
          </q-item-label>
        </a>
      </div>
      <q-separator class="q-my-xs" />

      <q-item-label class="text-center">
        <q-btn
          size="sm"
          flat
          round
          icon="delete"
          class="q-mt-xs q-ml-xs"
        >
          <q-tooltip>
            Delete Wallet
          </q-tooltip>
        </q-btn>
        <q-btn
          size="sm"
          flat
          round
          icon="edit"
          class="q-mt-xs q-ml-xs"
        >
          <q-tooltip>
            Rename Wallet
          </q-tooltip>
        </q-btn>
        <q-btn
          size="sm"
          flat
          round
          icon="content_copy"
          class="q-mt-xs q-ml-xs"
          @click="copyAddressContent()"
        >
          <q-tooltip>
            Copy Address
          </q-tooltip>
        </q-btn>
        <q-btn
          size="sm"
          flat
          round
          icon="file_copy"
          class="q-mt-xs q-ml-xs"
          @click="copyStackAddressContent()"
        >
          <q-tooltip>
            Copy StakeAddress
          </q-tooltip>
        </q-btn>
        <q-btn
          size="sm"
          flat
          round
          icon="qr_code_2"
          class="q-mt-xs q-ml-xs"
          @click="modelQr=true"
        >
          <q-tooltip>
            Scan
          </q-tooltip>
        </q-btn>
      </q-item-label>
      <!--      <q-item-label-->
      <!--        caption-->
      <!--        class="flex justify-between q-px-md"-->
      <!--      >-->
      <!--        &lt;!&ndash; <span>{{ props.qty }}</span> &ndash;&gt;-->
      <!--        &lt;!&ndash; <span>${{ props.usd }}</span> &ndash;&gt;-->
      <!--      </q-item-label>-->
    </q-item-section>

    <q-dialog
      v-model="modelQr"
      persistent
    >
      <q-card style="min-width: 800px">
        <q-card-section class="col-12 text-center">
          <span class="text-weight-bold text-h6">Address</span>
        </q-card-section>
        <q-card-section class="text-center q-pa-none">
          <figure>
            <qrcode
              class="qr"
              :value="address"
              :options="{
                scale: 8,
                color: {
                  dark: '#1d1d1d',
                  light: '#f5f5f5',
                },
              }"
            />
          </figure>
          {{ address }}
          <q-btn
            size="sm"
            flat
            round
            color="primary"
            icon="content_copy"
            @click="copyAddressContent()"
          >
            <q-tooltip>
              Copy Address
            </q-tooltip>
          </q-btn>
        </q-card-section>
        <q-card-actions
          align="right"
          class="q-pa-md"
        >
          <q-btn
            label="Close"
            color="negative"
            outline
            @click="modelQr=false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-item>
</template>

<script setup>
import { shortenAddress } from 'src/utils'
import randomColor from 'randomcolor/randomColor'
import { ref } from 'vue'
import { useQuasar, copyToClipboard } from 'quasar'
import qrcode from '@chenfengyuan/vue-qrcode'
import { useTransactionStore } from 'src/stores/transactions'

// eslint-disable-next-line vue/valid-define-props
const props = defineProps({
  address: String,
  // qty: Number,
  // usd: Number,
  num: Number,
  classify: String,
  currentNum: String,
  stackAddress: String,
  name: String,
  balance: Number
})
const $q = useQuasar()

const store = useTransactionStore()

const color = (seed) => {
  return randomColor({
    luminosity: $q.dark.isActive ? 'light' : 'dark',
    hue: 'rgb',
    alpha: 0.5,
    seed
  })
}

const modelQr = ref(false)

const copyAddressContent = () => {
  copyToClipboard(props.address)
    .then(() => {
      // success!
      $q.notify({
        message: 'Address copied to clipboard ',
        color: 'primary'
      })
    })
    .catch(() => {
      // fail
    })
}
const copyStackAddressContent = () => {
  copyToClipboard(props.stackAddress)
    .then(() => {
      // success!
      $q.notify({
        message: 'Stack Address copied to clipboard ',
        color: 'primary'
      })
    })
    .catch(() => {
      // fail
    })
}
</script>
