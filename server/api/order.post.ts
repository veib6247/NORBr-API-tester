import axios from 'axios'
import payloadBuilder from '../utils/payloadBuilder'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const payload = payloadBuilder(body.dataParameters)

  const url = body.isOrderForRecurring
    ? 'https://api-sandbox.norbr.io/order/create'
    : 'https://api-sandbox.norbr.io/payment/order'

  console.log(`Using URL: ${url}`)

  try {
    const { data } = await axios({
      method: 'POST',
      headers: {
        'x-api-key': body.privateKey,
        version: '1.0.0',
      },
      url: url,
      data: payload,
    })

    return data

    //
  } catch (error: any) {
    if (error.response) {
      console.error(error.response.data)
      return error.response.data
    }
  }
})
