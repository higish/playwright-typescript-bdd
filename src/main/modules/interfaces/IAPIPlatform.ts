export default interface IAPIPlatform {

  verifyStatusCode(statusCode: number): void

  generateAccessTokenUsingMockJsonFile(): Promise<void>

  prepareRequestBodyUsingMockData(requestBody: string) : void

  prepareRequestHeaders(requestHeaders: object) : void

  prepareAnEndpoint(endpointValue: string) : void

  sendGetRequest(bodyType: string): Promise<void>

  sendPostRequest(bodyType: string): Promise<void>

  saveResponseDataToJsonFileUsingJsonPath(jsonPathToTheData: string, objectNameKey: string, jsonFileName: string): void

}