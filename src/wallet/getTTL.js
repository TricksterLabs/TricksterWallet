export async function getTTL () {
  try {
    const getTip = await fetch('https://api.koios.rest/api/v0/tip', {
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
