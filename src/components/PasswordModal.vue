<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="inception" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Your password</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            type="password"
            v-model="password"
            autofocus
            @keyup.enter="checkPassword"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            flat
            label="Set Password"
            v-if="!pwd"
            @click="secondDialog = true"
          />
          <q-btn flat label="Sign In" @click="checkPassword" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="secondDialog"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">New password</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            type="password"
            label="New Password"
            v-model="newPwd"
            autofocus
            @keyup.enter="setPassword"
          />
        </q-card-section>
        <q-card-section>
          <q-input
            dense
            type="password"
            v-model="confirmPassword"
            label="Confirm Password"
            autofocus
            @keyup.enter="checkPassword"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Set Password" @click="setPassword" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { datab, getFromDb } from 'src/dexie/db'
import CryptoJS from 'crypto-js'
import { useQuasar } from 'quasar'
const $q = useQuasar()

const emit = defineEmits(['passed'])

const inception = ref(true)
const secondDialog = ref(false)
const pwd = ref(null)
const password = ref('')
const confirmPassword = ref('')
const newPwd = ref('')

const db = datab

const salt = 'my-secret-key@123'

const encryptString = (str) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(str),
    salt
  ).toString()
}
const decryptString = (str) => {
  return JSON.parse(CryptoJS.AES.decrypt(
    str,
    salt
  ).toString(CryptoJS.enc.Utf8))
}

const setPassword = async () => {
  try {
    if (newPwd.value === '') return
    const ciphertext = encryptString(newPwd.value)
    // Add the new friend!
    const id = await db.password.add({
      pwd: ciphertext
    })
    console.log('id', id, ciphertext)
    pwd.value = ciphertext
    secondDialog.value = false
  } catch (error) {}
}

const checkPassword = () => {
  // clearTable();
  if (password.value === '') return
  const bytes = decryptString(pwd.value)
  if (bytes === password.value) {
    console.log('passed')
    emit('passed')
    $q.notify({
      type: 'positive',
      message: 'Success'
    })
  } else {
    $q.notify({
      type: 'negative',
      message: 'Failure'
    })
  }
}

getFromDb().then((value) => {
  console.log('currentPassword', value)
  pwd.value = value ? value.pwd : null
})
</script>
