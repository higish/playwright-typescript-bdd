import { Given, Then} from '@cucumber/cucumber';
import { getDataValue, platform } from '../hooks/GlobalData';

Then('user validates the dashboard', async function () {
    await platform.validateDashboard()
});