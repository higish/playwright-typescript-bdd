import { Locator } from "@playwright/test";
import { browserDetails } from "../hooks/GlobalData";

export default class DashboardPage {

    static getDashboardHeader(): Locator { return browserDetails.page.locator("#ModivcareLogoLink") }
}