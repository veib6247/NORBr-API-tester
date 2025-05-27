type JsonPayload = { [key: string]: string }

/**
 * make himay to convert to object as payload for Axios
 * @param dataParameters
 */
export default function (dataParameters: string) {
  const payloadArray = dataParameters.split('\n')
  const payload: JsonPayload = {}

  for (const item of payloadArray) {
    // split only on the first instance of the "=" sign
    // i mean sure, i could've just indexed the location of the first "=" but where's the fun in that?
    const itemArr = item.split(/=(.+)/)
    payload[itemArr[0]] = itemArr[1]
  }

  return payload
}
