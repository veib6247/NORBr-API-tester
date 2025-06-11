export type RequestBody = {
  isJsonPayload: boolean
  jsonParameters?: string
  privateKey: string
  versionNumber: number
  dataParameters: string
  orderId?: string
  maintenanceType?: string
}
