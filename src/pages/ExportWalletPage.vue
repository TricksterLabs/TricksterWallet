<template>
  <q-page
    class="q-pa-sm text-weight-bolder"
  >
    <q-card>
      <q-card-section>
        <div class="text-h6 text-center">
          Export Wallets
        </div>
      </q-card-section>
      <q-card-actions
        align="center"
        class="q-mr-lg q-pb-md"
      >
        <q-btn
          label="Generate"
          color="positive"
          outline
          @click="showAll"
        />
      </q-card-actions>
      <q-card-section class="col-12 items-center">
        <q-item class="full-width">
          <q-item-section>
            <q-input
              dense
              disable
              autogrow
              class="textarea"
              v-model.number="amountOfWallet"
              input-class=""
              label="Wallet private keys, one per line"
              outlined
            />
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { dbData } from '../dexie/db'
// import { liveQuery } from 'dexie'
import { exportWallet } from '../wallet/exportWallet'

const amountOfWallet = ref('')
// const stack = ref('')
// const isMingledAddress = ref(false)

// const generateWallets = () => {
//   for (let i = 0; i < amountOfWallet.value; i++) {
//     genWallet()
//   }
// }

const showAll = async () => {
  const wallets = await dbData.wallet.toArray()
  const walletsMnemonics = []
  for (let i = 0; i < wallets.length; i++) {
    walletsMnemonics.push(wallets[i].id, await exportWallet(wallets[i].entropy))
  }
  amountOfWallet.value = walletsMnemonics
  // console.log(wallets)
}

</script>
