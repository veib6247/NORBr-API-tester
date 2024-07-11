import axios from 'axios'

declare const process: {
  env: {
    NETHONE_USERNAME: string
    NETHONE_KEY: string
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  try {
    const { data } = await axios({
      method: 'POST',
      auth: {
        username: process.env.NETHONE_USERNAME,
        password: process.env.NETHONE_KEY,
      },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      url: 'https://api.nethone.io/v1/inquiries',
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
