# Modivcare QA Automation Framework
This framework is based on Playwright, TypeScript, and Cucumber BDD.

### Legend:

* [Project Structure](#project-structure)
* [API Integration](#api-integration)
* [Framework Architecture and Design](#framework-architecture-and-design)
* [Local Setup](#local-setup)

### Prerequisites
- **Node.js**: Ensure you have Node.js installed. Download and install it from [Node.js](#https://nodejs.org/en).


- **npm**: npm is included with Node.js. Verify the installation by running npm -v in your terminal.


- **Aqua or Visual Studio Code (VSCode)**: Recommended IDEs for working with the framework. Download and install [Aqua](#https://www.jetbrains.com/aqua/) or [VSCode](#https://code.visualstudio.com/).


- **Git**: Ensure you have Git installed. Download and install it from [Git](#https://git-scm.com/).
## Project Structure
- **/src/main/modules**: All modules and their implementations.


- **/src/main/pageObjects**: Directory for all page objects.


- **/src/main/step_definitions**: Step definitions for Cucumber.


- **/src/main/hooks**: One-time functions like driver initiation and teardown, as well as configurations.


- **/src/main/helpers**: Common methods used across the framework.


- **/src/main/exceptions**: Custom exceptions.


- **/src/resources/feature**: All Cucumber feature files.


- **/src/resources/testData/mockData**: Specific test cases and their expected values.


- **/src/resources/testData/_default**: Default mock values and commonly expected texts.


- **/src/main/TestRunner.ts**: The runner class for executing tests.


- **/output**: Directory where the Cucumber execution report (index.html) is generated. This folder is refreshed every time tests are run, and screenshots are attached to failing test cases.

Playwright annotations such as **@BeforeAll**, **@Before**, and **@After** are used for setup and teardown respectively.
## Executing Test Automation
### Installation
To install all the necessary packages, run:
```
npm install
```
### Configuration
- Update **TestRunner.ts** with desired tags, number of threads and retries on failure.

- Update **Environment.config** with either Environment.dev.config or Environment.stg.config based on the execution environment.
### Execution
To execute the automation suite, run:
```
npm test
```
## Framework Architecture and Design
* Below are examples of creating a module, interface, and pageObject for the Authentication module.
#### Page Objects
- All object locators should be in their respective modules within the **pageObjects** directory (**/src/main/pageObjects**).

- Create page objects here to use in respective modules. The page must have the module's name and 'Page' added to it.

Example:
```
export default class AuthPageTripcare {
   static getRememberMeCheckBox(): Locator { 
      return browserDetails.page.locator("#rememberMe") 
   }
}
```
#### Modules/Interfaces

- Every module in **src/main/modules** must be abstract and have a corresponding interface in **src/main/modules/interfaces**.

- The interface's name must be the same as the module's with 'I' prepended to it.

- Platform.ts is the only class that extends all other modules, allowing functions from different modules to be called.

Example:
- **IAuthModule.ts**: Interface for authentication page functions.
```
export interface IAuthModule{
   clickRememberMeCheckBox(): Promise<void>;
}
```
- **AuthModule.ts**: Abstract class implementing **IAuthModule.ts**.
```   
export abstract class AuthModule implements IAuthModule {
   async clickRememberMeCheckBox(): Promise<void> {
      try {
         await expect(AuthPage.getRememberMeCheckBox()).toBeVisible({timeout: 2000, visible: true})
         await AuthPage.getRememberMeCheckBox().click()
      } catch (e) {
         throw new UnknownErrorException("Failed to accept remember me checkbox", e as Error)
      }
   }
}
```
- **Platform.ts**: Class extending **AuthModule.ts** and inheriting its functions.
```    
export default class Platform extends classes (APIPlatform, AuthModule, DashbordModule) { }
```
#### Step Defitions

- Each module will have a corresponding file in the **step_definitions** directory where its steps are implemented.

Example:

Scenario step:
```
And user clicks on rememberMe check box
```
Step Implementation:
```
Given('user clicks on rememberMe check box', async function () {
    await platform.clickRememberMeCheckBox();
});
```
### API Integration
The **APIIntegrationSteps.ts** file contains API functions to perform pre-processing steps, such as creating a user at runtime instead of hardcoding users via UI steps.

Example: This step creates a user with the given JSON body and saves it in a temporary variable available only during the execution of that scenario.
```
Given user registers a new user from api with {string} body and {string} email
```
### Creating Feature Files
- For every feature file that is created in **src/resources/features/**, a corresponding Yaml file must be created in **src/resources/testData/mockData/**, ensuring the folder/file structure and naming conventions match exactly.

- Each feature file must contain at most 10 scenarios to maintain readability and easier grouping.

**Feature File**: **src/resources/features/existingUserLogin**
```
ExistingUserEmailLogin.feature
```
**Yaml test data**: **src/resources/testData/mockData/existingUserLogin**
```
ExistingUserEmailLogin.yaml
```
- Every feature file must have a feature name, a short description, and a background with common starting steps. A tag can be added at the top of the file, applicable to all scenarios within.

Example:
```
@smoke
Feature: ExistingUserEmailLogin
    Description: Scenarios for Exiting User Email Login

    Background:
        And user validates login page
```
### Creating Scenarios
- A scenario must be added to the feature file it is most relevant to. Each scenario must have a unique ID (e.g., TES-) that maps to its test ID in the test repository. It should also include any other relevant tags such as 'smoke', 'automated', 'regression'.

- The test data file must be created in its respective file, where the scenario key in the YAML file matches the scenario title in the feature file.

Example:
```
@TES-0001
Scenario: Verify successful login for registered users
```
```
mockStringData:
   testCaseId: TES-0001
   scenario: Verify successful login for registered users
```

- **src/resources/testData/_default/_default.yaml** contains all keys used in the test scenario. The data is divided into two categories: **mockStringData** and **mockExpectedText**.

    - **mockStringData**: Mock data related to the scenario/user (e.g., date of birth, email address, password).

    - **mockExpectedText**: Expected text for text validation only.

Example:

**TextValue.yaml** holds the key and its text value.
```
invalidPasswordError: |-
   Login failed. Too many failed attempts will put a temporary lock on your account.
```
In the scenario:
```
mockStringData:
   testCaseId: TES-0004
   scenario: Verify correct error message is displayed for invalid password entry
mockExpectedText:
   expectedText1: invalidPasswordError
```
### Major Libraries used
```
{
  "dependencies": {
    "@playwright/test": "^1.0.0",
    "@cucumber/cucumber": "^7.0.0",
    "typescript": "^4.0.0"
  }
}
```
## Local Setup
### Prerequisites
- Ensure that Node.js and npm are installed on your machine.

- Install an IDE such as Visual Studio Code or Aqua.
### Setup Steps
1. Clone the Repository:
```
git clone https://github.com/higish/playwright-typescript-bdd.git
cd playwright-typescript-bdd
```
2. Install Dependencies:
    - Run the following command to install all necessary dependencies:
```
npm install
```
3. Configure Environment:
    - Copy the environment configuration file for the desired environment:
```
cp config/Environment.dev.json config/Environment.json
```
- Update the Environment.json file with the appropriate configuration settings
4. Run Tests:
    - To run the test suite, use the following command:
```
npm test
```
5. View Reports:
    - After the tests complete, view the generated report in the output directory. Open the index.html file in a browser to see detailed test results, including screenshots of any failures.
