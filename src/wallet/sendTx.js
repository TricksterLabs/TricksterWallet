import axios from 'axios'

const headers = {
  'Content-Type': 'application/cbor'
}

export async function sendTx (tx) {
  try {
    const newTx = await axios.post('https://eu-fr.trickster.fi/api/v0/submittx', tx, { headers })
    // const newTx = await axios.post('/api', tx, { headers })
    return newTx
  } catch (error) {
    console.error(error)
  }
}
