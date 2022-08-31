import PQueue from 'p-queue'

const queueWallet = new PQueue({
  concurrency: 100, // Concurrency limit.
  timeout: 30000, // Per-operation timeout in milliseconds. Operations fulfill once timeout elapses if they haven't already.
  throwOnTimeout: false, // Whether or not a timeout is considered an exception.
  autoStart: true, // Whether queue tasks within concurrency limit, are auto-executed as soon as they're added.
  intervalCap: 100, // The max number of runs in the given interval of time.
  interval: 60000, // The length of time in milliseconds before the interval count resets. Must be finite.
  carryoverConcurrencyCount: true // If true, specifies that any pending Promises, should be carried over into the next interval and counted against the intervalCap. If false, any of those pending Promises will not count towards the next intervalCap.
})

// const queueAnalytics = new PQueue({
//   concurrency: 60, // Concurrency limit.
//   timeout: 30000, // Per-operation timeout in milliseconds. Operations fulfill once timeout elapses if they haven't already.
//   throwOnTimeout: false, // Whether or not a timeout is considered an exception.
//   autoStart: true, // Whether queue tasks within concurrency limit, are auto-executed as soon as they're added.
//   intervalCap: 60, // The max number of runs in the given interval of time.
//   interval: 60000, // The length of time in milliseconds before the interval count resets. Must be finite.
//   carryoverConcurrencyCount: true // If true, specifies that any pending Promises, should be carried over into the next interval and counted against the intervalCap. If false, any of those pending Promises will not count towards the next intervalCap.
// })

const getTip = async () => {
  try {
    const res = await fetch('https://eu-fr.trickster.fi/api/v0/tip', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log('TipData', await res.json())
    return res
  } catch (e) {
    console.error(e)
  }
}

// let count = 0
// const getPolicyData = async () => {
//   try {
//     const res = await fetch('https://api.opencnft.io/1/policy/c204b7595ab87f70a4a4d3a6c40833e8942b990bacf492090fe8b4d3', {
//       method: 'GET',
//       headers: {
//         accept: 'application/json'
//       }
//     })
//     count = count + 1
//     console.log(count, await res.json())
//     return res
//   } catch (e) {
//     count = count + 1
//     console.error(count, e)
//   }
// }

const tasksWallet = async () => {
  const task = getTip
  for (let i = 0; i < 1000; i++) {
    // console.log('Adding to queue ' + i)
    await queueWallet.add(task)
    console.log('Wallet ' + i)
  }
  // console.log('Anonymous', task)
}

// const taskArray = []
// const tasksPolicyData = async () => {
//   const task = getPolicyData
//   for (let i = 0; i < 1000; i++) {
//     taskArray.push(task)
//   }
//   await queueAnalytics.addAll(taskArray)
// }

// await tasksPolicyData()
await tasksWallet()

// export { tasks }

// (async () => {
//   const task = await getTip(2)
//   await queue.add(task)
//   // console.log('Anonymous', task)
// })()

// export { getTip }

// (async () => {
//   await queue.add(() => got('https://sindresorhus.com'))
//   console.log('Done: sindresorhus.com')
// })();

// (async () => {
//   await queue.add(() => got('https://avajs.dev'))
//   console.log('Done: avajs.dev')
// })();

// (async () => {
//   const task = await getUnicornTask()
//   await queue.add(task)
//   console.log('Done: Unicorn task')
// })()
