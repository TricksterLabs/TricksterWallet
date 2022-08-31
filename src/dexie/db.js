import Dexie from 'dexie'
import { clearAllTables } from 'dexie-encrypted'

const dbSettings = new Dexie('trickster-settings')

dbSettings.version(6).stores({
  password: '++id, pwd'
})

export const getFromDb = async () => {
  const data = await dbSettings.password.get(1)
  return data
}

export const clearTable = async () => {
  await clearAllTables(dbSettings)
}

const dbData = new Dexie('trickster-data')

dbData.version(1).stores({
  wallet: '++id' // Primary key and indexed props
})

dbData.open().catch(function (e) {
  console.error('Open failed: ' + e)
})

export { dbData, dbSettings }
