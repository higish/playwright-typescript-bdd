import { browserDetails, environmentConfig } from '../hooks/GlobalData';
import { Browser, BrowserContext, chromium, Page } from '@playwright/test';

let browser: Browser = browserDetails.browser

export async function initializeDriver(): Promise<void> {
  browser = await chromium.launch({ headless: false });
  browserDetails.browser = browser
}

export async function launch(): Promise<void> {
  const context: BrowserContext = await browser.newContext();
  browserDetails.context = context;

  const page: Page = await context.newPage();
  browserDetails.page = page

  await page.goto(environmentConfig.app.baseUri, { timeout: 30000 })
}

export async function destroy(): Promise<void> {
  await browserDetails.page.close();
  await browserDetails.context.close()
}

export async function closeDriver(): Promise<void> {
  await browserDetails.browser.close()
}