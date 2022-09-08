<template>
  <q-page
    class="q-pa-sm text-weight-bolder"
  >
    <q-card>
      <q-card-section>
        <div class="text-h6">
          Create Wallet
        </div>
      </q-card-section>
      <q-card-section class="col-12 items-center">
        <q-item class="full-width">
          <q-item-section>
            <q-input
              dense
              v-model.number="amountOfWallet"
              input-class=""
              label="Amount of Wallet to Generate"
              outlined
            />
          </q-item-section>
        </q-item>
        <q-item class="full-width">
          <q-item-section>
            <q-toggle
              v-model="isMingledAddress"
              color="pink"
              label="Is Mingled Address"
            />
          </q-item-section>
        </q-item>
        <q-item
          class="full-width"
          v-if="isMingledAddress"
        >
          <q-item-section>
            <q-input
              dense
              v-model.number="stack"
              input-class=""
              label="Stack"
              outlined
            />
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-card-actions
        align="right"
        class="q-mr-lg q-pb-md"
      >
        <q-btn
          label="Generate"
          color="positive"
          outline
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const amountOfWallet = ref(1)
const stack = ref('')
const isMingledAddress = ref(false)
</script>
