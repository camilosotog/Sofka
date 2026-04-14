import { Page, Locator, expect } from "@playwright/test";

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string): Promise<void> {
    const response = await this.page.goto(url);
    if (!response || !response.ok()) {
      throw new Error(
        `Error al navegar a ${url}: status ${response?.status() ?? "sin respuesta"}`,
      );
    }
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
  }

  /**
   * Espera a que un elemento sea visible y lo retorna
   */
  async waitForElement(
    locator: Locator,
    description: string,
    timeout = 10000,
  ): Promise<Locator> {
    await expect(locator, `Elemento no visible: ${description}`).toBeVisible({
      timeout,
    });
    return locator;
  }

  /**
   * Hace clic en un elemento verificando que sea visible primero
   */
  async safeClick(locator: Locator, description: string): Promise<void> {
    await this.waitForElement(locator, description);
    await locator.click();
  }

  /**
   * Llena un campo de texto verificando que sea visible primero
   */
  async safeFill(
    locator: Locator,
    value: string,
    description: string,
  ): Promise<void> {
    await this.waitForElement(locator, description);
    await locator.fill(value);
  }

  /**
   * Navega a una sección/módulo del sitio
   */
  async goToModule(moduleName: string): Promise<void> {
    const link = this.page.getByRole("link", {
      name: moduleName,
      exact: true,
    });
    await this.safeClick(link, `Módulo: ${moduleName}`);
    await this.waitForPageLoad();
  }
}
