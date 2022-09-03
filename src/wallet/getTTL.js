export async function getTTL () {
  try {
    const getTip = await fetch('https://eu-fr.trickster.fi/api/v0/tip', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'

      }
    })
    const resultGetTip = await getTip.json()
    return resultGetTip[0].abs_slot
  } catch (error) {
    console.error(error)
  }
}
