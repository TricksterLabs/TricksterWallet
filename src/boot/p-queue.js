import { useWalletsStore } from 'stores/wallets'
import { storeToRefs } from 'pinia'

const { wallets, history } = storeToRefs(await useWalletsStore())

const worker = new SharedWorker(new URL('./p-queue.worker.js', import.meta.url), {
  type: 'module'
})

// console.log(JSON.parse(JSON.stringify(await wallets.value)))

// async function sendMessage () {
//   worker.port.postMessage(JSON.parse(JSON.stringify(await wallets.value)))
// }

// sendMessage()

// console.log(JSON.parse(JSON.stringify(await wallets.value)))
function delay (milisec) {
  return new Promise(resolve => {
    setTimeout(() => { resolve('') }, milisec)
  })
}

const merge = (obj1, obj2) => ({ ...obj1, ...obj2 })
const transformArray = async () => {
  async function walletsCompute () { return JSON.parse(JSON.stringify(await wallets.value)) }
  async function historyCompute () { return JSON.parse(JSON.stringify(await history.value)) }
  const walletsArray = await walletsCompute()
  const historyArray = await historyCompute()
  // console.log(0, walletsArray)
  // console.log(1, historyArray)
  const dataArray = []
  for (let i = 0; i < walletsArray.length; i++) {
    dataArray[i] = merge(walletsArray[i], historyArray[i])
  }
  return dataArray
}

// console.log('wallets', dataArray)

// worker.port.postMessage((await transformArray()))

async function reCheck () {
  while (true) {
    worker.port.postMessage(await transformArray())
    await delay(20000)
  }
}

reCheck()

// for await (const greeting of interval(1000)) console.log(greeting)

worker.port.onmessage = (e) => {
  const result = e.data
  console.log('Getting new results from: ', result)
}
