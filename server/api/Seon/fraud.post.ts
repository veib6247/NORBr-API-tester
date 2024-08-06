import axios from 'axios'

declare const process: {
  env: {
    SEON_KEY: string
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  try {
    const { data } = await axios({
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.SEON_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      url: 'https://api.us-east-1-main.seon.io/SeonRestService/fraud-api/v2/',
      data: body,
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
