import { DataTable, Given } from '@cucumber/cucumber';
import { platform } from '../hooks/GlobalData';
import {
  retrieveJsonObjectFromJsonFile,
  updateJsonFileWithRandomValues
} from '../helpers/APIDataHelper';

const authenticationJsonDataFile: string = 'services/AuthenticationData.Json';
const headerDataFileName: string = 'services/APIHeaders.json';
const jsonDataFileName: string = 'global/GlobalDynamicData.json'

Given('user registers a new user from api with {string} body and {string} email', async function(dynamicRequestBodyNameKey: string, emailKey: string) {
  let requestBodyJsonString: string = retrieveJsonObjectFromJsonFile(dynamicRequestBodyNameKey, authenticationJsonDataFile);
  if (JSON.stringify(requestBodyJsonString).includes('random'))
    requestBodyJsonString = updateJsonFileWithRandomValues(requestBodyJsonString);
  platform.prepareAnEndpoint("/authentication-service/lgtcUser/signUp")
  platform.prepareRequestHeaders(JSON.parse(retrieveJsonObjectFromJsonFile("tripcareNewUserRegistration", headerDataFileName)) as object)
  platform.prepareRequestBodyUsingMockData(requestBodyJsonString)
  await platform.generateAccessTokenUsingMockJsonFile()
  platform.verifyStatusCode(200);
  platform.saveResponseDataToJsonFileUsingJsonPath('$.userCode', "userCode", jsonDataFileName)

  platform.prepareRequestHeaders(JSON.parse(retrieveJsonObjectFromJsonFile("tripcareGetUserWithUserCode", headerDataFileName)) as object);
  platform.prepareAnEndpoint("/authentication-service/lgtcUser");

  await platform.sendGetRequest("raw-no-access-token-no-body")
  platform.verifyStatusCode(200);
  platform.saveResponseDataToJsonFileUsingJsonPath('$.data.email', emailKey, jsonDataFileName)
});

Given('user sends GET request with {string} body, {string} headers and {string} endpoint', async function(body: string, headerKey: string, endpoint: string) {
  platform.prepareRequestHeaders(JSON.parse(retrieveJsonObjectFromJsonFile(headerKey, headerDataFileName)) as object);
  platform.prepareAnEndpoint(endpoint);
  await platform.sendGetRequest(body)
});

Given('user sends POST request with {string} body, {string} headers and {string} endpoint', async function(body: string, headerKey: string, endpoint: string) {
  platform.prepareRequestHeaders(JSON.parse(retrieveJsonObjectFromJsonFile(headerKey, headerDataFileName)) as object);
  platform.prepareAnEndpoint(endpoint);
  await platform.sendPostRequest(body)
});

Given('user sends PUT request with {string} body, {string} headers and {string} endpoint', async function(body: string, headerKey: string, endpoint: string) {
  platform.prepareRequestHeaders(JSON.parse(retrieveJsonObjectFromJsonFile(headerKey, headerDataFileName)) as object);
  platform.prepareAnEndpoint(endpoint);
  await platform.sendPostRequest(body)
});

Given('user registers a new user with different profile values from api with {string} body and {string} email', async function(dynamicRequestBodyNameKey: string, emailKey: string, dataTable: DataTable) {
  let requestBodyJsonString: string = retrieveJsonObjectFromJsonFile(dynamicRequestBodyNameKey, authenticationJsonDataFile);
  const modifiable: { [key: string]: string } = {}
  dataTable.raw().forEach((it) => {
    modifiable[it[0]] = it[1]
  })
  requestBodyJsonString = JSON.stringify({...JSON.parse(requestBodyJsonString), ...modifiable})
  if (JSON.stringify(requestBodyJsonString).includes('random'))
    requestBodyJsonString = updateJsonFileWithRandomValues(requestBodyJsonString);

  platform.prepareAnEndpoint("/authentication-service/lgtcUser/signUp")
  platform.prepareRequestHeaders(JSON.parse(retrieveJsonObjectFromJsonFile("tripcareNewUserRegistration", headerDataFileName)) as object)
  platform.prepareRequestBodyUsingMockData(requestBodyJsonString)
  await platform.generateAccessTokenUsingMockJsonFile()
  platform.verifyStatusCode(200);
  platform.saveResponseDataToJsonFileUsingJsonPath('$.userCode', "userCode", jsonDataFileName)

  platform.prepareRequestHeaders(JSON.parse(retrieveJsonObjectFromJsonFile("tripcareGetUserWithUserCode", headerDataFileName)) as object);
  platform.prepareAnEndpoint("/authentication-service/lgtcUser");
  await platform.sendGetRequest("raw-no-access-token-no-body")
  platform.verifyStatusCode(200);
  platform.saveResponseDataToJsonFileUsingJsonPath('$.data.email', emailKey, jsonDataFileName)
});