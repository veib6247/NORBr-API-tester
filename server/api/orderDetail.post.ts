import axios from 'axios'

export default defineEventHandler(async (event) => {
  const body = await readBody<RequestBody>(event)
  const version = body.versionNumber
  const headers = {
    'x-api-key': body.privateKey,
    version: version.toString(),
  }
  const url = `https://api-sandbox.norbr.io/payment/order/${body.orderId}`

  try {
    const { data } = await axios({
      method: 'GET',
      headers: headers,
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
