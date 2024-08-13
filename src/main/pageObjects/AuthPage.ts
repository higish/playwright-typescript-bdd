import {Locator} from "playwright";
import { browserDetails } from '../hooks/GlobalData';

export default class AuthPage {

    static getLoginPageHeaderText(): Locator { return browserDetails.page.locator("[class='login-section member-login']") }

    static getEmailEntryInputField() : Locator { return browserDetails.page.locator("#inputEmail"); }

    static getPasswordEntryInputField() : Locator { return browserDetails.page.locator("#inputPassword"); }

    static getLoginButton() : Locator { return browserDetails.page.locator("#loginButton"); }

    static getErrorMessageOfPasswordField(): Locator { return browserDetails.page.locator("#generalLoginError") }

    static getRememberMeCheckBox(): Locator { return browserDetails.page.locator("#rememberMe") }
}