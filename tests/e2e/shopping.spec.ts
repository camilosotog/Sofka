import { test, expect } from "@playwright/test";
import { BuyPage } from "../pages/buy.page";
import { readCsv } from "../../src/csv-reader";
import { Bill } from "../interfaces/bill.interface";
import { Product } from "../interfaces/product.interface";

// ---------- Datos externos desde CSV ----------
interface ProductRow {
  product1: string;
  product2: string;
  [key: string]: string;
}

const billsData = readCsv<Bill & { [key: string]: string }>(
  "tests/data/csv/bills.csv",
);
const productsData = readCsv<ProductRow>("tests/data/csv/products.csv");

// ---------- Escenarios Outline: Flujo completo de compra ----------

test.describe("Validación de funciones de compra en demoblaze", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  for (let i = 0; i < productsData.length; i++) {
    const products = productsData[i];
    const bill = billsData[i % billsData.length];

    test(`Escenario ${i + 1}: Compra de "${products.product1}" y "${products.product2}" con datos de ${bill.name}`, async ({
      page,
    }) => {
      const buyPage = new BuyPage(page);
      const product1: Product = { name: products.product1 };
      const product2: Product = { name: products.product2 };

      await test.step(`Agregar "${product1.name}" al carrito`, async () => {
        const [response] = await Promise.all([
          page.waitForResponse(
            (r) => r.url().includes("addtocart") && r.status() === 200,
          ),
          buyPage.addToCart(product1),
        ]);
        await expect(
          response.status(),
          `El producto ${product1.name} NO se agregó al carrito`,
        ).toBe(200);
      });

      await test.step("Volver al Home", async () => {
        await buyPage.goToModule("Home (current)");
      });

      await test.step(`Agregar "${product2.name}" al carrito`, async () => {
        const [response] = await Promise.all([
          page.waitForResponse(
            (r) => r.url().includes("addtocart") && r.status() === 200,
          ),
          buyPage.addToCart(product2),
        ]);
        await expect(
          response.status(),
          `El producto ${product2.name} NO se agregó al carrito`,
        ).toBe(200);
      });

      await test.step("Visualizar el carrito", async () => {
        await buyPage.goToModule("Cart");
        await expect(
          page.getByRole("heading", { name: "Products" }),
          "NO es la sección de carrito",
        ).toBeVisible();
        await expect(
          page.getByRole("cell", { name: product1.name }),
          `${product1.name} NO está visible en el carrito`,
        ).toBeVisible();
        await expect(
          page.getByRole("cell", { name: product2.name }),
          `${product2.name} NO está visible en el carrito`,
        ).toBeVisible();
      });

      await test.step(`Completar formulario con datos de ${bill.name}`, async () => {
        await buyPage.fillPurchaseForm(bill);
        await expect(
          page.getByRole("textbox", { name: "Name:" }),
          "No se completó el campo Name",
        ).toHaveValue(bill.name);
        await expect(
          page.getByRole("textbox", { name: "Country:" }),
          "No se completó el campo Country",
        ).toHaveValue(bill.country);
        await expect(
          page.getByRole("textbox", { name: "City:" }),
          "No se completó el campo City",
        ).toHaveValue(bill.city);
        await expect(
          page.getByRole("textbox", { name: "Credit card:" }),
          "No se completó el campo Credit Card",
        ).toHaveValue(bill.creditCard);
        await expect(
          page.getByRole("textbox", { name: "Month:" }),
          "No se completó el campo Month",
        ).toHaveValue(bill.month);
        await expect(
          page.getByRole("textbox", { name: "Year:" }),
          "No se completó el campo Year",
        ).toHaveValue(bill.year);
      });

      await test.step("Finalizar la compra", async () => {
        await buyPage.completePurchase();
        await expect(
          buyPage.successTitle,
          "No se realizó la compra exitosamente",
        ).toBeVisible();
      });
    });
  }
});
