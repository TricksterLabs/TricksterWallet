<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog
      v-model="inception"
      persistent
    >
      <q-card style="min-width: 350px">
        <q-card-section class="text-center">
          <q-avatar
            size="103px"
            class="shadow-10"
          >
            <img src="profile.svg">
          </q-avatar>
          <div class="text-h6 q-mt-sm">
            Login
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            type="password"
            v-model="password"
            autofocus
            outlined
            label="Password"
            @keyup.enter="checkPassword"
          />
        </q-card-section>

        <q-card-actions
          align="right"
          class="text-primary"
        >
          <q-btn
            outline
            class="text-capitalize"
            label="Set Password"
            v-if="!pwd"
            @click="secondDialog = true"
          />
          <q-btn
            outline
            class="text-capitalize"
            label="Sign In"
            :disable="!password"
            @click="checkPassword"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="secondDialog"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="min-width: 350px">
        <q-card-section class="text-center">
          <q-avatar
            size="103px"
            class="shadow-10"
          >
            <img src="profile.svg">
          </q-avatar>
          <div class="text-h6 q-mt-sm">
            Sign Up
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            type="password"
            label="New Password"
            v-model="newPwd"
            autofocus
            outlined
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
            outlined
            @keyup.enter="setPassword"
          />
        </q-card-section>

        <q-card-actions
          align="right"
          class="text-primary"
        >
          <q-btn
            label="Cancel"
            class="text-capitalize"
            v-close-popup
            outline
          />
          <q-btn
            outline
            class="text-capitalize"
            label="Set Password"
            @click="setPassword"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { dbSettings, getFromDb } from 'src/dexie/db'
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

const db = dbSettings

const salt = CryptoJS.lib.WordArray.random(128 / 8)

const generateKey = (secret, salt) => {
  return CryptoJS.PBKDF2(
    secret,
    salt,
    {
      keySize: 512 / 32, // size in Words
      iterations: 1000,
      hasher: CryptoJS.algo.SHA512
    }
  )
}

const generatePasswordHash = (key, salt) => {
  return (salt.toString() + key.toString())
}
const checkPasswordD = (password, hashedPassword) => {
  const saltString = hashedPassword.slice(0, 32)
  const saltWordArray = CryptoJS.enc.Hex.parse(saltString)
  const keyString = hashedPassword.slice(32)
  const newKeyString = generateKey(password, saltWordArray).toString()
  return (keyString === newKeyString)
}

// const salt = 'my-secret-key@123'

// const encryptString = (str) => {
//   return CryptoJS.AES.encrypt(
//     JSON.stringify(str),
//     salt
//   ).toString()
// }
// const decryptString = (str) => {
//   return JSON.parse(CryptoJS.AES.decrypt(
//     str,
//     salt
//   ).toString(CryptoJS.enc.Utf8))
// }

const setPassword = async () => {
  if (newPwd.value === confirmPassword.value) {
    try {
      if (newPwd.value === '') return
      const key = generateKey(newPwd.value, salt)
      const ciphertext = generatePasswordHash(key, salt)
      // Add the new friend!
      const id = await db.password.add({
        pwd: ciphertext
      })
      $q.notify({
        type: 'positive',
        message: 'Signed Up Successfully'
      })
      console.log('id', id, ciphertext)
      pwd.value = ciphertext
      secondDialog.value = false
    } catch (error) {}
  } else {
    $q.notify({
      type: 'negative',
      message: 'Password Mismatch'
    })
  }
}

const checkPassword = () => {
  // clearTable();
  if (password.value === '') return
  if (checkPasswordD(password.value, pwd.value)) {
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
