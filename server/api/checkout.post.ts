import axios from 'axios'

export default defineEventHandler(async (event) => {
  const body = await readBody<RequestBody>(event)
  const isJsonPayload = body.isJsonPayload
  const url = 'https://api-sandbox.norbr.io/payment/checkout'
  const headers = headerBuilder(body)
  const payload = isJsonPayload
    ? JSON.parse(body.jsonParameters || '{}')
    : payloadBuilder(body.dataParameters)

  try {
    const { data } = await axios({
      method: 'POST',
      headers: headers,
      url: url,
      data: payload,
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
