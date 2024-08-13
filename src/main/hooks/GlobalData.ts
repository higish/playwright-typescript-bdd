import { Browser, BrowserContext, Page } from '@playwright/test';
import { retrieveJsonObjectFromJsonFile } from '../helpers/APIDataHelper';
import Platform from '../modules/Platform';
import { readEnvironmentFile } from '../helpers/EnvironmentConfigHelper';
import { EnvironmentConfig } from '../types/EnvironmentConfig';
import { MockData } from '../types/MockData';

export const browserDetails = {
  browser: undefined as unknown as Browser,
  context: undefined as unknown as BrowserContext,
  page: undefined as unknown as Page,
}

export const environmentConfig: EnvironmentConfig = readEnvironmentFile()

export const platform : Platform = new Platform()

const globalData : Map<string, string> = new Map<string, string>()

export function getDataValue(key: string): string {
  if (globalData.get(key) == undefined) return retrieveJsonObjectFromJsonFile(key, 'global/GlobalDynamicData.json')
  else return globalData.get(key) as string
}

export function saveDataValue(key: string, newValue: string): string {
  if (globalData.get(key) == undefined && newValue !== ""){
    globalData.set(key, newValue)
    return newValue
  } else if (globalData.get(key) !== undefined && newValue !== ""){
    globalData.delete(key)
    globalData.set(key, newValue)
    return newValue
  } else
    return JSON.stringify(globalData.get(key))
}

export function addMockDataPropertiesToGlobalData(mockData: MockData): void {
  for (const [key, value] of Object.entries(mockData.mockStringData))
    globalData.set(key, value)

  for (const [key, value] of Object.entries(mockData.mockExpectedText))
    globalData.set(key, value)
}