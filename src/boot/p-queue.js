import { useWalletsStore } from 'stores/wallets'

const store = useWalletsStore()

const worker = new SharedWorker(new URL('./p-queue.worker.js', import.meta.url), {
  type: 'module'
})

async function sendMessage () {
  worker.port.postMessage(await store.wallets)
}

sendMessage()

// console.log(JSON.parse(JSON.stringify(await store.wallets2)))
function waitforme (milisec) {
  return new Promise(resolve => {
    setTimeout(() => { resolve('') }, milisec)
  })
}

async function printy () {
  while (true) {
    await waitforme(5000)
    worker.port.postMessage(JSON.parse(JSON.stringify(await store.wallets)))
  }
}

printy()

// for await (const greeting of interval(1000)) console.log(greeting)

worker.port.onmessage = (e) => {
  const result = e.data
  console.log('Getting new results from: ', result)
}
