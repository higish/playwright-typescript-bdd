import fs from 'fs';
import { generateEmail } from './RandomDataGenerator';
import UnknownErrorException from '../exceptions/UnknownErrorException';
import jsonpath from 'jsonpath';
import { getDataValue } from '../hooks/GlobalData';

export type DynamicData = Record<string, unknown>;

export function retrieveJsonObjectFromJsonFile(objectNameKey: string, jsonFileName: string): string {
  const fileData: string = fs.readFileSync('src/resources/testData/'+ jsonFileName, 'utf-8');

  const jsonData: Record<string, string> = JSON.parse(fileData) as Record<string, string>;

  if (typeof jsonData[objectNameKey] == 'string')
    return jsonData[objectNameKey]
  else
    return JSON.stringify(jsonData[objectNameKey])
}

export function updateJsonObjectWithJsonValueFromFile(strObjectToBeUpdated: string, strObjectToUpdateWith: string, strPropertyToBeUpdated: string): string {
  const jsonObjectToBeUpdated: DynamicData = JSON.parse(strObjectToBeUpdated) as DynamicData
  const jsonObjectToUpdateWith: DynamicData = JSON.parse(strObjectToUpdateWith) as DynamicData

  for (const key in jsonObjectToBeUpdated) {
    if (Object.prototype.hasOwnProperty.call(jsonObjectToBeUpdated, key)) {
      if (key === strPropertyToBeUpdated) {
        delete jsonObjectToBeUpdated[strPropertyToBeUpdated];
        break;
      }
    }
  }

  jsonObjectToBeUpdated[strPropertyToBeUpdated] = jsonObjectToUpdateWith;
  return JSON.stringify(jsonObjectToBeUpdated);
}

export function updateJsonFileWithRandomValues(jsonObjectString: string): string {
  const jsonSegmentList: string[] = jsonObjectString.split(",")

  jsonSegmentList.forEach(eachSegment => {
    if (eachSegment.includes('randomCurrentDateAndTime'))
      jsonSegmentList[jsonSegmentList.indexOf(eachSegment)] = eachSegment.replace('randomCurrentDateAndTime', new Date().toString())
    if (eachSegment.includes('randomEmail'))
      jsonSegmentList[jsonSegmentList.indexOf(eachSegment)] = eachSegment.replace('randomEmail', generateEmail())
  })
  return jsonSegmentList.join(",")
}

export function saveObjectIntoJsonFile(key: string, newValue: string, jsonFileName: string): void {
  const filePath = `src/resources/testData/${jsonFileName}`;
  let jsonData: DynamicData = {};

  if (fs.existsSync(filePath)) {
    const fileData: string = fs.readFileSync(filePath, 'utf-8');
    try {
      jsonData = JSON.parse(fileData) as DynamicData;
    } catch (error) {
      throw new UnknownErrorException('Failed to parse the JSON data', error as Error);
    }
  }
  jsonData[key] = newValue;
  try {
    const updatedData: string = JSON.stringify(jsonData, null, 2);
    fs.writeFileSync(filePath, updatedData);
  } catch (error) {
    throw new UnknownErrorException('Failed to save JSON data into the file', error as Error);
  }
}

export function getDataFromJsonUsingJsonPath(jsonString: string, jsonPath: string): string[] {
  const jsonObject: object = JSON.parse(jsonString) as object;
  return jsonpath.query(jsonObject, jsonPath) as string[]
}

export function replaceDynamicKeyWithActualValues(jsonObject: unknown): unknown {
  const traverseAndReplace = (obj: unknown): unknown => {
    if (typeof obj === 'object' && obj !== null) {
      if (Array.isArray(obj))  return obj.map(item => traverseAndReplace(item));
      else {
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            // @ts-ignore
            const value = obj[key];
            if (typeof value === 'string') {
              const regex = /\{(.*?)\}/g;
              let result = value;
              let match;
              while ((match = regex.exec(value)) !== null) {
                const dynamicKey = match[1];
                const actualValue = getDataValue(dynamicKey);
                result = result.replace(`{${dynamicKey}}`, actualValue);
              }
              // @ts-ignore
              obj[key] = result;
            } else { // @ts-ignore
              obj[key] = traverseAndReplace(value);
            }
          }
        }
      }
    }
    return obj;
  }
  return traverseAndReplace(jsonObject)
}