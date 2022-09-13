// import axios from 'axios'

// const headers = {
//   'Content-Type': 'application/cbor'
// }

export async function sendTx (tx) {
  try {
    // const newTx = await axios.post('https://eu-fr.trickster.fi/api/v0/submittx', tx, { headers })
    // const newTx = await fetch('https://eu-fr.trickster.fi/api/v0/submittx', {
    const newTx = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/cbor'
        // 'Access-Control-Allow-Origin': '*'
      },
      body: tx
    })
    const resultNewTx = await newTx.json()
    return resultNewTx
  } catch (error) {
    console.error(error)
  }
}

// const newTx = await fetch('https://eu-fr.trickster.fi/api/v0/address_txs', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json'
//     // 'Access-Control-Allow-Origin': '*'
//   },
//   body: JSON.stringify(
//     {
//       _addresses: [
//         address
//       ],
//       _after_block_height: lastHeight
//       // _after_block_height: 0
//     }
//   )
// })
// const resultNewTx = await newTx.json()
