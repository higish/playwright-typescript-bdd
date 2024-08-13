import { After, AfterAll, Before, BeforeAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { closeDriver, destroy, initializeDriver, launch } from '../helpers/DriverHelper';
import { loadScenarioYamlFile } from '../helpers/MockDataHelper';
import { endScenario, startScenario } from '../helpers/LogHelper';
import { takeScreenShot } from '../helpers/ScreenCapture';
import { ITestCaseHookParameter } from '@cucumber/cucumber/lib/support_code_library_builder/types';

setDefaultTimeout(60 * 1000)

BeforeAll(async () => {
  await initializeDriver()
});


Before(async ({pickle}: ITestCaseHookParameter) => {

  startScenario(pickle.name)

  loadScenarioYamlFile(pickle)
  await launch()
});

After(async function({ pickle, result }: ITestCaseHookParameter) {
  if (result?.status != Status.PASSED) {
    const screenshot: Buffer = await takeScreenShot(pickle.name);
    if (screenshot.length > 1)
      this.attach(screenshot, 'image/png');
  }
  endScenario()
  await destroy()
});

AfterAll(async () => {
  await closeDriver()
});