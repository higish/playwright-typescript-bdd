export interface IAuthModule{

    validateLoginScreen(): Promise<void>

    enterEmailAddress(email: string): Promise<void>

    enterPassword(password: string): Promise<void>

    clickLoginButton(): Promise<void>

    clickRememberMeCheckBox(): Promise<void>

    validatesErrorMessageOfPasswordField(expectedText: string): Promise<void>

}