import fs from 'node:fs';
import UnknownErrorException from '../exceptions/UnknownErrorException';
import { EnvironmentConfig } from '../types/EnvironmentConfig';

export function readEnvironmentFile(): EnvironmentConfig {
  try {
    const fileData: string = fs.readFileSync('src/resources/configs/Environment.json', { encoding: 'utf-8' });

    return JSON.parse(fileData) as EnvironmentConfig
  } catch (error) {
    throw new UnknownErrorException("Failed to parse and read Environment config file", error as Error)
  }
}