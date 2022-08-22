import Dexie from 'dexie'
import { clearAllTables } from 'dexie-encrypted'

export const datab = new Dexie('MyDatabase')

datab.version(6).stores({
  password: '++id, pwd'
})

export const getFromDb = async () => {
  const data = await datab.password.get(1)
  return data
}

export const clearTable = async () => {
  await clearAllTables(datab)
}
