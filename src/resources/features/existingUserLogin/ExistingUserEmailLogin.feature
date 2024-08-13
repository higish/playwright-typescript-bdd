@smoke
Feature: ExistingUserEmailLogin
  Description: Scenarios for Exiting User Email Login

  Background:
    And user validates login page

  @TES-0001
  Scenario: Verify successful login for registered users
    Given user registers a new user from api with "tripcareUserRegister" body and "newlyCreatedUser1" email
    When user enters "newlyCreatedUser1" on email entry field
    And user enters "password" on password entry field
    And user clicks on rememberMe check box
    And user clicks on login button
    Then user validates the dashboard

  @TES-0002
  Scenario: Verify successful login for registered users with dynamic data
    Given user registers a new user with different profile values from api with "userRegisterWithDifferentProfileValues" body and "newlyCreatedUser2" email
      | firstName | Jo    |
      | lastName  | Buddy |
    When user enters "newlyCreatedUser2" on email entry field
    And user enters "password" on password entry field
    And user clicks on login button
    Then user validates the dashboard


  @TES-0003
  Scenario: Verify successful login for existing user
    Given user enters "emailAddress" on email entry field
    When user enters "password" on password entry field
    And user clicks on login button
    Then user validates the dashboard

  @TES-0004 @errorMessage
  Scenario: Verify correct error message is displayed for invalid password entry
    Given user enters "emailAddress" on email entry field
    When user enters "password" on password entry field
    And user clicks on login button
    Then user validates error message of password field with "expectedText1"