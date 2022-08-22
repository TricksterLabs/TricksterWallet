import Dexie from 'dexie'

const db = new Dexie('myDatabase')

db.version(1).stores({
  wallet: '++id', // Primary key and indexed props
  utxo_set: 'id',
  transactions: 'id'
})

db.open().catch(function (e) {
  console.error('Open failed: ' + e)
})

export { db }
