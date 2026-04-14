import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {
  readonly loginLink: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.loginLink = page.getByRole("link", { name: "Log in" });
    this.usernameInput = page.locator("#loginusername");
    this.passwordInput = page.locator("#loginpassword");
    this.loginButton = page.getByRole("button", { name: "Log in" });
  }

  async login(username: string, password: string): Promise<void> {
    await this.safeClick(this.loginLink, "Link Log in");
    await this.safeFill(this.usernameInput, username, "Campo Username");
    await this.safeFill(this.passwordInput, password, "Campo Password");
    await this.safeClick(this.loginButton, "Botón Log in");
  }
}
