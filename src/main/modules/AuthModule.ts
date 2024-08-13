import { expect } from '@playwright/test';
import { setDefaultTimeout } from '@cucumber/cucumber';
import AuthPage from '../pageObjects/AuthPage';
import AssertionFailedException from '../exceptions/AssertionFailedException';
import UnknownErrorException from '../exceptions/UnknownErrorException';
import { IAuthModule } from "./interfaces/IAuthModule";

setDefaultTimeout(60 * 1000);

export abstract class AuthModule implements IAuthModule {
    async validateLoginScreen(): Promise<void> {
        try {
            await expect(AuthPage.getLoginPageHeaderText()).toBeVisible()
        } catch (e) {
            throw new AssertionFailedException("Failed to validate login page", e as Error)
        }
    }
    async enterEmailAddress(email: string): Promise<void> {
        try {
            await expect(AuthPage.getEmailEntryInputField()).toBeVisible()
            await AuthPage.getEmailEntryInputField().fill(email)
        } catch (e) {
            throw new UnknownErrorException("Failed to enter email address in login page", e as Error)
        }
    }
    async enterPassword(password: string): Promise<void> {
        try {
            await expect(AuthPage.getPasswordEntryInputField()).toBeVisible()
            await AuthPage.getPasswordEntryInputField().fill(password)
        } catch (e) {
            throw new UnknownErrorException("Failed to enter password in login page", e as Error)
        }
    }
    async clickLoginButton(): Promise<void> {
        try {
            await expect(AuthPage.getLoginButton()).toBeVisible()
            await AuthPage.getLoginButton().click()
        } catch (e) {
            throw new UnknownErrorException("Failed to click Login Button in login page", e as Error)
        }
    }
    async clickRememberMeCheckBox(): Promise<void> {
        try {
            await expect(AuthPage.getRememberMeCheckBox()).toBeVisible()
            await AuthPage.getRememberMeCheckBox().click()
        } catch (e) {
            throw new UnknownErrorException("Failed to accept remember me checkbox", e as Error)
        }
    }
    async validatesErrorMessageOfPasswordField(expectedText: string): Promise<void> {
        try {
            await expect(AuthPage.getErrorMessageOfPasswordField()).toBeVisible()
            await expect(AuthPage.getErrorMessageOfPasswordField()).toHaveText(expectedText)
        } catch (e) {
            throw new AssertionFailedException("Failed to validate error message of Password field", e as Error)
        }
    }
}