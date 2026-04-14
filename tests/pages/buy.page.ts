import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import { Bill } from "../interfaces/bill.interface";
import { Product } from "../interfaces/product.interface";

export class BuyPage extends BasePage {
  // Locators del carrito
  readonly addToCartLink: Locator;
  readonly placeOrderButton: Locator;
  readonly purchaseButton: Locator;
  readonly successTitle: Locator;

  // Locators del formulario de compra
  readonly nameInput: Locator;
  readonly countryInput: Locator;
  readonly cityInput: Locator;
  readonly creditCardInput: Locator;
  readonly monthInput: Locator;
  readonly yearInput: Locator;

  constructor(page: Page) {
    super(page);
    this.addToCartLink = page.getByRole("link", { name: "Add to cart" });
    this.placeOrderButton = page.getByRole("button", { name: "Place Order" });
    this.purchaseButton = page.getByRole("button", { name: "Purchase" });
    this.successTitle = page.getByRole("heading", {
      name: "Thank you for your purchase!",
    });
    this.nameInput = page.locator("#name");
    this.countryInput = page.locator("#country");
    this.cityInput = page.locator("#city");
    this.creditCardInput = page.locator("#card");
    this.monthInput = page.locator("#month");
    this.yearInput = page.locator("#year");
  }

  async addToCart(product: Product): Promise<void> {
    const productLink = this.page.getByRole("link", { name: product.name });
    await this.safeClick(productLink, `Producto: ${product.name}`);
    await this.safeClick(this.addToCartLink, "Botón Add to cart");
  }

  async fillPurchaseForm(bill: Bill): Promise<void> {
    await this.safeClick(this.placeOrderButton, "Botón Place Order");
    await this.safeFill(this.nameInput, bill.name, "Campo Name");
    await this.safeFill(this.countryInput, bill.country, "Campo Country");
    await this.safeFill(this.cityInput, bill.city, "Campo City");
    await this.safeFill(
      this.creditCardInput,
      bill.creditCard,
      "Campo Credit Card",
    );
    await this.safeFill(this.monthInput, bill.month, "Campo Month");
    await this.safeFill(this.yearInput, bill.year, "Campo Year");
  }

  async completePurchase(): Promise<void> {
    await this.safeClick(this.purchaseButton, "Botón Purchase");
  }
}
