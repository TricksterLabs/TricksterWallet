import { useWalletsStore } from 'stores/wallets'

const store = useWalletsStore()

const worker = new SharedWorker(new URL('./p-queue.worker.js', import.meta.url), {
  type: 'module'
})

// const wallets = await store.wallets

// function sleep (milliseconds) {
//   const date = Date.now()
//   let currentDate = null
//   do {
//     currentDate = Date.now()
//   } while (currentDate - date < milliseconds)
// worker.port.postMessage(await store.wallets)
// // }
async function sendMessage () {
  worker.port.postMessage(await store.wallets)
}

// sendMessage()
// for (let i = 0; i < 500; i++) {
//   setTimeout(async () => {
//     await sendMessage()
//     console.log(i)
//   }, 5000)
// }

sendMessage()
// for (let i = 0; i < 100; i++) {
// await setTimeout(worker.port.postMessage(await store.wallets)
//   , 3000)
// sleep(5000)
// }

worker.port.onmessage = (e) => {
  const result = e.data
  console.log('Worker: ', result)
}
