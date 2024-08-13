import fs from 'fs';
import { promisify } from 'util';
import { browserDetails } from '../hooks/GlobalData';
import UnknownErrorException from '../exceptions/UnknownErrorException';

const readFileAsync = promisify(fs.readFile);

export async function takeScreenShot(fileName: string): Promise<Buffer> {
  try {
    const screenshotPath = `./output/screenshots/${fileName}.png`;
    await browserDetails.page.screenshot({
      path: screenshotPath,
      type: 'png'
    });
    return await readFileAsync(screenshotPath);
  } catch (error) {
    throw new UnknownErrorException('Failed to take screenshot', error as Error);
  }
}