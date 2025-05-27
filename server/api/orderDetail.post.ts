import axios from 'axios'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const version = body.versionNumber

  const url = `https://api-sandbox.norbr.io/payment/order/${body.orderId}`

  try {
    const { data } = await axios({
      method: 'GET',
      headers: {
        'x-api-key': body.privateKey,
        version: version.toString(),
      },
      url: url,
    })

    return data

    //
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(error.response.data)
        return error.response.data
      }
    }
  }
})
