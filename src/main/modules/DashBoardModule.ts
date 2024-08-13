import { expect } from "@playwright/test"
import { IDashboardModule } from "./interfaces/IDashboardModule"
import AssertionFailedException from "../exceptions/AssertionFailedException"
import DashboardPage from "../pageObjects/DashboardPage"
import { setDefaultTimeout } from "@cucumber/cucumber";

setDefaultTimeout(60 * 1000);

export abstract class DashbordModule implements IDashboardModule {

  async validateDashboard(): Promise<void> {
    try {
      await expect(DashboardPage.getDashboardHeader()).toBeVisible()
    } catch (e) {
      throw new AssertionFailedException("Failed to validate dashboard" , e as Error)
    }
  }
}