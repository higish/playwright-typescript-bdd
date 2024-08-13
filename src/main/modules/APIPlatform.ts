import IAPIPlatform from './interfaces/IAPIPlatform';
import { expect } from '@playwright/test';
import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import UnknownErrorException from '../exceptions/UnknownErrorException';
import { environmentConfig, getDataValue } from '../hooks/GlobalData';
import {
  replaceDynamicKeyWithActualValues,
  getDataFromJsonUsingJsonPath,
  saveObjectIntoJsonFile
} from '../helpers/APIDataHelper';
import stringify from 'safe-stable-stringify'

export abstract class APIPlatform implements IAPIPlatform {

  baseUri: string = environmentConfig.api.baseUri;
  response: AxiosResponse<string, string> | AxiosError | null = null;
  responseBodyJson: string = '';
  accessToken: string = '';
  endpoint: string = '';
  headers: { [key: string]: string } = {};
  requestBodyString: string = '';
  params: object = {}

  async generateAccessTokenUsingMockJsonFile(): Promise<void> {

    const config = {
      baseURL: this.baseUri,
      method: 'POST',
      url: this.endpoint,
      headers: this.headers,
      data: this.requestBodyString,
      params: this.params
    };

    try {
      const response: AxiosResponse = await axios(config);

      this.response = response;
      this.responseBodyJson = JSON.stringify(response.data);
      this.accessToken = getDataFromJsonUsingJsonPath(this.responseBodyJson, '$..accessToken')[0];
    } catch (error) {
      throw new UnknownErrorException('Error while fetching access token:', error as Error);
    }
  }

  prepareRequestBodyUsingMockData(requestBody: string) : void {
    try {
      this.requestBodyString = requestBody;
    } catch (error) {
      throw new UnknownErrorException("Error while preparing a request body", error as Error);
    }
  }

  prepareRequestHeaders(requestHeaders: object) : void {
    this.headers = replaceDynamicKeyWithActualValues(requestHeaders) as { [key: string]: string }
    this.params = JSON.parse(JSON.stringify(this.headers['params'])) as object
    this.headers = JSON.parse(JSON.stringify(this.headers['headers'])) as { [key: string]: string }
  }

  prepareAnEndpoint(endpointValue: string) : void {
    const endpoint: string = endpointValue;
    const regex = /\{(.*?)\}/g; // Match anything between { and }, non-greedy
    const matches: string[] = [];
    let match;

    while ((match = regex.exec(endpoint)) !== null)
      matches.push(match[1]);

    for (const dynamicValue of matches)
      endpoint.replace('{' + dynamicValue + '}', getDataValue(dynamicValue))
    this.endpoint = endpoint
  }

  verifyStatusCode(statusCode: number): void {
    expect(this.response?.status).toBe(statusCode);
  }

  saveResponseDataToJsonFileUsingJsonPath(jsonPathToTheData: string, objectNameKey: string, jsonFileName: string): void {
    const jsonData: string = getDataFromJsonUsingJsonPath(this.responseBodyJson, jsonPathToTheData)[0];
    saveObjectIntoJsonFile(objectNameKey, jsonData, jsonFileName);
  }

  private async sendRequest(method: 'GET' | 'POST' | 'PUT' | 'DELETE', bodyType: string, data: unknown = null): Promise<void> {
    const headers: { [key: string]: string } = { ...this.headers };
    if (!bodyType.includes('no-access-token'))
      headers['Authorization'] = `Bearer ${this.accessToken}`;

    const config: AxiosRequestConfig = {
      baseURL: this.baseUri,
      url: this.endpoint,
      headers: headers,
      method: method,
      data: data,
      params: this.params
    };


    this.response = await axios(config);
    this.responseBodyJson = stringify(this.response);
  }

  async sendGetRequest(bodyType: string): Promise<void> {
    try {
      switch (bodyType) {
        case 'none':
          await this.sendRequest('GET', bodyType);
          break;
        case 'raw-no-access-token':
          await this.sendRequest('GET', bodyType, this.requestBodyString);
          break;
        case 'raw-no-access-token-no-body':
          await this.sendRequest('GET', bodyType);
          break;
        default:
          throw new UnknownErrorException('Invalid request body type is used:' + bodyType, new Error());
      }
    } catch (error) {
      throw new UnknownErrorException('Error while sending GET request:', error as Error);
    }
  }

  async sendPostRequest(bodyType: string): Promise<void> {
    try {
      switch (bodyType) {
        case 'raw':
          await this.sendRequest('POST', bodyType, this.requestBodyString);
          break;
        case 'none':
          await this.sendRequest('POST', bodyType);
          break;
        case 'raw-no-access-token':
          await this.sendRequest('POST', bodyType, JSON.parse(this.requestBodyString));
          break;
        default:
          throw new UnknownErrorException('Invalid request body type is used:' + bodyType, new Error());
      }
    } catch (error) {
      throw new UnknownErrorException('Error while sending GET request:', error as Error);
    }
  }
}