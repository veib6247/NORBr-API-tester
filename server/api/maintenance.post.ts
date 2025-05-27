import axios from 'axios'
import payloadBuilder from '../utils/payloadBuilder'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const payload = payloadBuilder(body.dataParameters)
  const version = body.versionNumber

  try {
    const { data } = await axios({
      method: 'POST',
      headers: {
        'x-api-key': body.privateKey,
        version: version.toString(),
      },
      url: `https://api-sandbox.norbr.io/payment/maintenance/${body.maintenanceType}/${body.orderId}`,
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
