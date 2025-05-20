import crypto from 'node:crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const secretFromConfiguration = body.secret
  const ivfromHttpHeader = body.iv
  const authTagFromHttpHeader = body.authTag
  const httpBody = body.httpBody

  try {
    // Convert data to process
    const key = Buffer.from(secretFromConfiguration, 'hex')
    const iv = Buffer.from(ivfromHttpHeader, 'hex')
    const authTag = Buffer.from(authTagFromHttpHeader, 'hex')
    const cipherText = Buffer.from(httpBody, 'hex')

    // Prepare decryption - explicitly use Uint8Array to satisfy TypeScript
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      Uint8Array.from(key),
      Uint8Array.from(iv)
    )
    decipher.setAuthTag(Uint8Array.from(authTag))

    // Decrypt - convert the Buffer to Uint8Array
    const decrypted = Buffer.concat([
      decipher.update(Uint8Array.from(cipherText)),
      decipher.final(),
    ])

    return JSON.parse(decrypted.toString('utf8'))
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      body: error,
    }
  }
})
