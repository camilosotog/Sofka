# Proyecto Playwright + TypeScript

Proyecto de testing automatizado configurado con Playwright y TypeScript, listo para empezar a codificar.

## 📋 Requisitos

- Node.js (v16 o superior)
- npm o yarn

## 🚀 Instalación

1. Instala las dependencias:

```bash
npm install
```

## 📝 Scripts Disponibles

- **`npm test`** - Ejecuta todos los tests
- **`npm run test:ui`** - Ejecuta tests en modo UI interactivo
- **`npm run test:debug`** - Ejecuta tests en modo debug
- **`npm run test:headed`** - Ejecuta tests con interfaz del navegador visible
- **`npm run test:chrome`** - Ejecuta tests solo en Chrome
- **`npm run test:firefox`** - Ejecuta tests solo en Firefox
- **`npm run test:webkit`** - Ejecuta tests solo en Safari
- **`npm run codegen`** - Inicia el code generator de Playwright
- **`npm run report`** - Muestra el reporte HTML de tests

## 📁 Estructura del Proyecto

```
├── tests/
│   ├── pages/              # Page Object Model (POM)
│   │   ├── BasePage.ts     # Clase base para páginas
│   │   └── ExamplePage.ts  # Ejemplo de página
│   └── example.spec.ts     # Ejemplo de archivo de tests
├── src/
│   └── utils.ts            # Utilidades útiles
├── playwright.config.ts    # Configuración de Playwright
├── tsconfig.json           # Configuración de TypeScript
├── package.json            # Dependencias y scripts
└── README.md
```

## 💡 Cómo Empezar

### 1. Crear un nuevo test

Crea un archivo terminado en `.spec.ts` en la carpeta `tests/`:

```typescript
import { test, expect } from "@playwright/test";

test("mi primer test", async ({ page }) => {
  await page.goto("https://example.com");
  await expect(page).toHaveTitle(/Example/);
});
```

### 2. Usar Page Object Model (Recomendado)

Crea una nueva página en `tests/pages/`:

```typescript
import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class MyPage extends BasePage {
  readonly myElement = this.page.locator('button[id="my-btn"]');

  constructor(page: Page) {
    super(page);
  }

  async clickMyButton() {
    await this.myElement.click();
  }
}
```

Úsala en tu test:

```typescript
import { test, expect } from "@playwright/test";
import { MyPage } from "./pages/MyPage";

test("interactuar con elementos", async ({ page }) => {
  const myPage = new MyPage(page);
  await myPage.goto("https://example.com");
  await myPage.clickMyButton();
});
```

## 🔍 Selector Types

Playwright soporta varios tipos de selectores:

```typescript
// CSS
page.locator("button.submit");

// XPath
page.locator('//button[@id="submit"]');

// Text
page.locator('button:has-text("Click me")');

// Role
page.locator('role=button[name="Click me"]');

// Data attributes
page.locator('[data-testid="submit-button"]');
```

## 📊 Generador de Tests (Codegen)

Usa el generador de tests de Playwright:

```bash
npm run codegen https://example.com
```

Esto abrirá una interfaz donde puedes interactuar con el sitio y Playwright generará automáticamente el código de test.

## 🐧 Modo Debug

Para debuggear tests:

```bash
npm run test:debug
```

## 📈 Consideraciones de Arquitectura

Este proyecto está estructurado siguiendo el patrón **Page Object Model (POM)**:

- **BasePage**: Clase base con funcionalidades comunes
- **Pages específicas**: Heredan de BasePage y contienen localizadores y métodos específicos
- **Tests**: Importan las páginas y usan sus métodos

Ventajas del POM:

- Mantenibilidad mejorada
- Reutilización de código
- Tests más legibles

## 🚨 Configuración Importante

### Base URL

Para establecer una URL base, descomenta en `playwright.config.ts`:

```typescript
use: {
  baseURL: 'http://127.0.0.1:3000',
}
```

Luego en tests:

```typescript
await page.goto("/"); // Irá a http://127.0.0.1:3000/
```

### Servidor Local

Para ejecutar un servidor antes de los tests, descomenta en `playwright.config.ts`:

```typescript
webServer: {
  command: 'npm run start',
  url: 'http://127.0.0.1:3000',
  reuseExistingServer: !process.env.CI,
}
```

hola
