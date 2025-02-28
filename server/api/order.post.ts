// import axios from 'axios'
import type { FetchError } from 'ofetch'
import payloadBuilder from '../utils/payloadBuilder'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const payload = payloadBuilder(body.dataParameters)

  try {
    const res = await $fetch('https://api-sandbox.norbr.io/payment/order', {
      method: 'POST',
      headers: {
        'x-api-key': body.privateKey,
        version: '1.0.0',
      },
      body: payload,
    })

    return res

    //
  } catch (error: unknown) {
    // Type assertion to FetchError
    const fetchError = error as FetchError

    // Now TypeScript knows the structure
    const status = fetchError.response?.status || 500
    const statusText =
      fetchError.response?.statusText || 'Internal Server Error'
    const errorData =
      fetchError.response?._data || fetchError.message || 'Unknown error'

    // Log the error on server
    console.error('API request failed:', {
      status,
      error: errorData,
    })

    // Send an appropriate error response
    event.node.res.statusCode = status
    console.info('statusCode:', status)

    return {
      success: false,
      error: {
        status,
        message: statusText,
        details: errorData,
      },
    }
  }
})
