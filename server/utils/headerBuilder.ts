type NorbrHeaders = {
  'x-api-key': string
  version: string
}

/**
 * Builds the headers for the Norbr API request.
 * @param requestBody The request body containing necessary information.
 * @returns The headers to be included in the API request.
 */
export default function (requestBody: RequestBody): NorbrHeaders {
  const headers: NorbrHeaders = {
    'x-api-key': requestBody.privateKey,
    version: requestBody.versionNumber.toString(),
  }

  return headers
}
