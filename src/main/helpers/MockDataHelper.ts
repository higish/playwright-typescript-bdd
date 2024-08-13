import * as fs from 'node:fs';
import * as yaml from 'js-yaml';
import UnknownErrorException from '../exceptions/UnknownErrorException';
import { MockData } from '../types/MockData';
import { Pickle } from '@cucumber/messages/dist/esm/src/messages';
import { addMockDataPropertiesToGlobalData } from '../hooks/GlobalData';
import { MockExpectedText } from '../types/MockExpectedText';

function loadYAMLData(filename: string): MockData[] {
  try {
    const fileContents: string = fs.readFileSync(filename, 'utf8');
    return yaml.loadAll(fileContents) as MockData[];
  } catch (error) {
    throw new UnknownErrorException(`Error loading YAML file ${filename}:`, error as Error);
  }
}

function loadDefaultYamlFile(): MockData {
  const defaultData: MockData[] = loadYAMLData('src/resources/testData/_default/_default.yaml');
  return defaultData[0];
}

function processMockStringData(currentScenarioYaml: MockData): MockData {

  const mockStringTextValue: Record<string, string>[] = yaml.loadAll(fs.readFileSync('src/resources/testData/_default/TextValue.yaml', 'utf8')) as Record<string, string>[];

  const mockExpectedText: MockExpectedText = currentScenarioYaml.mockExpectedText;

  if (!Object.is(mockExpectedText, undefined)) {
    if (mockExpectedText.expectedText1 != undefined)
      mockExpectedText.expectedText1 = mockStringTextValue[0][mockExpectedText.expectedText1];
    if (mockExpectedText.expectedText2 != undefined)
      mockExpectedText.expectedText2 = mockStringTextValue[0][mockExpectedText.expectedText2];
    if (mockExpectedText.expectedText3 != undefined)
      mockExpectedText.expectedText3 = mockStringTextValue[0][mockExpectedText.expectedText3];
    if (mockExpectedText.expectedText4 != undefined)
      mockExpectedText.expectedText4 = mockStringTextValue[0][mockExpectedText.expectedText4];
    if (mockExpectedText.expectedText5 != undefined)
      mockExpectedText.expectedText5 = mockStringTextValue[0][mockExpectedText.expectedText5];
    if (mockExpectedText.expectedText6 != undefined)
      mockExpectedText.expectedText6 = mockStringTextValue[0][mockExpectedText.expectedText6];
    if (mockExpectedText.expectedText7 != undefined)
      mockExpectedText.expectedText7 = mockStringTextValue[0][mockExpectedText.expectedText7];
    if (mockExpectedText.expectedText8 != undefined)
      mockExpectedText.expectedText8 = mockStringTextValue[0][mockExpectedText.expectedText8];

    currentScenarioYaml.mockExpectedText = mockExpectedText;
  }
  return currentScenarioYaml;
}

export function loadScenarioYamlFile(pickle: Pickle): void {

  const defaultData: MockData = loadDefaultYamlFile();

  let currentScenarioYaml!: MockData;

  if (!fs.existsSync(pickle.uri.replace('features', 'testData/mockData').replace('.feature', '.yaml'))) {
    throw new UnknownErrorException('Yaml Data of the scenario does not exists', new Error());
  }

  const scenarioYamlData: MockData[] = loadYAMLData(pickle.uri.replace('features', 'testData/mockData')
      .replace('.feature', '.yaml'));

  scenarioYamlData.forEach(function(item: MockData) {
    if (item.mockStringData.scenario == pickle.name)
      currentScenarioYaml = item;
  });

  currentScenarioYaml = processMockStringData(currentScenarioYaml);

  Object.assign(defaultData.mockStringData, currentScenarioYaml.mockStringData);
  Object.assign(defaultData.mockExpectedText, currentScenarioYaml.mockExpectedText);

  addMockDataPropertiesToGlobalData(defaultData);
}