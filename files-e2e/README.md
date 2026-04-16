# E2E Testing - Demoblaze Shopping Test

Este README documenta la estructura y configuración del proyecto de pruebas automatizadas E2E utilizando Playright

---

## Estructura de Tests

### Descripcion

La carpeta `tests/` contiene toda la estructura necesaria para ejecutar pruebas, organizada en subcarpetas para mantener el código limpio.

```
1. tests/
1.1. data           # Datos de prueba
1.2. e2e            # Pruebas (expect)
1.3. helpers        # Utilidades y funciones reutilizables durante todo el proyecto
1.4. interfaces     # Interfaces
1.5 pages           # Page Object Model - clases de páginas
       
```

---

### data --> Datos de Prueba

Esta carpeta contiene archivos con datos estáticos utilizados en las pruebas. Los datos se separan por constantes para facilitar el mantenimiento.

#### **bill.data.ts**
Define los datos de facturación para completar el formulario de compra.

#### **product.data.ts**
Define los productos que se utilizan en las pruebas de carrito.

#### **module.data.ts**
Define los módulos de la aplicación a los que se navega durante las pruebas.

#### **user.data.ts**
Define las credenciales de usuario para autenticación

---
### interfaces

Esta carpeta contiene interfaces que definen la estructura de los datos (/data) utilizados en las pruebas, brindando tipado.

#### **bill.interface.ts**
Define la estructura de datos para la facturación.

#### **product.interface.ts**
Define la estructura de datos para un producto.

#### **module.interface.ts**
Define la estructura de datos para un módulo de la aplicación.

#### **user.interface.ts**
Define la estructura de datos para credenciales de usuario login.

---
### e2e

Esta carpeta contiene los archivos `.spec.ts` que definen las pruebas o validaciones.

#### **shopping.spec.ts**
Especificación principal que valida el flujo completo de compra.

**Test Suite:** "Validación de funciones de compra en demoblaze"

**Test: "Flujo de compra"**

Valida el flujo completo desde agregar productos hasta completar la compra.

---

### pages

Patron Page Object Model para encapsular interacciones.

#### **buy.page.ts**
Clase que representa la página de compra y encapsula todas las acciones relacionadas con compras.

#### **login.page.ts**
Clase para interacciones de login

---

### helpers

Carpeta "servicios" con funciones reutilizables.

---

## Configuración de Playwright

### playwright.config.ts

Archivo de configuración principal.

#### **Directorio de Tests**

testDir: './tests/e2e'

Especifica que las pruebas se encuentran en la carpeta 'tests/e2e/'.

---

#### **Ejecución Paralela**

fullyParallel: false

No permite ejecutare todas las pruebas en paralelo.

---

#### **Reintentos**

- **Local:** 0 reintentos (fallan inmediatamente)
- **CI:** 2 reintentos automáticos en caso de fallo de alguno de los test

---

#### **Workers (Procesos Paralelos)**

- **Local:** Valor por defecto todos los procesadores disponibles
- **CI:** 1 worker para optimizar recursos

---

#### **Reporter**

Genera un reporte HTML interactivo en 'playwright-report/'.

---

#### **Configuración Compartida (use)**

- **baseURL:** URL base desde variables de .env
- **trace:** Genera trazas de Playwright solo al reintentar pruebas fallidas
- **video:** Grabación de video
- **screenshot:** Captura de pantalla luego del reporte

---

#### **Browsers**

Configuración para ejecutar pruebas en múltiples navegadores:

**Navegadores activos:**
- **Chromium** (Chrome/Edge)
- **Firefox**
- **WebKit** (Safari)

**Navegadores comentados:**
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)
- Microsoft Edge
- Google Chrome

---

#### **Variables de Ambiente**

- BASE_URL=https://www.demoblaze.com  (unica pagina para todo el proyecto)
- VIDEO=on (video siempre activo)
- SCREENSHOT=on (capturas siempre activas)

---

## Ejecución de Pruebas

### Ingresar a carpeta /e2e-ui/

cd e2e-ui

### Instalar dependencias

npm install

### Ejecutar todas las pruebas

npm run test

### Ejecutar pruebas con interfaz

npm run ui

---

## Reportes

### Reporte HTML

Después de ejecutar las pruebas, se genera un reporte en:


- playwright-report/index.html

**Características del reporte:**
- Resumen de pruebas (pasadas/fallidas)
- Tiempos de ejecución
- Capturas de pantalla de pasos fallidos
- Videos de pruebas
- Trazas de Playwright (trace=)

### Ver reporte

- npx playwright show-report
- npm run report

---

## Notas Adicionales

- El test utiliza **Page Object Model (POM)** para separar lógica de pruebas (expect)
- Los datos se centralizan en carpetas `data/` para mantenibilidad
- El patrón de pruebas sigue estructura de **test.step** para mejorar reportes
- Las pruebas se ejecutan contra **3 navegadores** de forma independiente

---


