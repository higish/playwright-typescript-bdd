import { Given, Then} from '@cucumber/cucumber';
import { getDataValue, platform } from '../hooks/GlobalData';

Given('user validates login page', async function () {
  await platform.validateLoginScreen();
})

Given('user enters {string} on email entry field', async function (email: string) {
  await platform.enterEmailAddress(getDataValue(email))
})

Given('user enters {string} on password entry field', async function (password: string) {
  await platform.enterPassword(getDataValue(password))
})

Given('user clicks on login button', async function () {
  await platform.clickLoginButton()
})

Given('user clicks on rememberMe check box', async function () {
  await platform.clickRememberMeCheckBox();
})

Then('user validates error message of password field with {string}', async function (expectedText: string) {
  await platform.validatesErrorMessageOfPasswordField(getDataValue(expectedText))
})