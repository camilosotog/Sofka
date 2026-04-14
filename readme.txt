===============================================================================
                    INSTRUCCIONES DE EJECUCIÓN
           Prueba E2E - Flujo de Compra en DemoBlaze.com
===============================================================================

REQUISITOS PREVIOS:
-------------------
1. Node.js versión 16 o superior instalado
2. Git instalado (opcional, para clonar el repositorio)


PASOS DE INSTALACIÓN:
--------------------

1. Clonar o descargar el repositorio:
   - Opción A: Clonar con Git
     git clone [URL_DEL_REPOSITORIO]
     cd Sofka

   - Opción B: Descargar ZIP
     Descargar el ZIP, extraer y navegar a la carpeta

2. Instalar dependencias del proyecto:
   npm install

3. Instalar navegadores de Playwright:
   npx playwright install


EJECUCIÓN DE LOS TESTS:
-----------------------

1. Ejecutar TODOS los tests en modo headless (sin interfaz):
   npm test

2. Ejecutar tests en modo UI interactivo (recomendado para desarrollo):
   npm run test:ui

3. Ejecutar tests en modo debug (para depuración):
   npm run test:debug

4. Ejecutar tests con interfaz visible del navegador:
   npm run test:headed

5. Ejecutar solo en Chromium:
   npm run test:chrome


VER REPORTES:
-------------

1. Después de ejecutar los tests, ver el reporte HTML:
   npm run report

   Esto abrirá automáticamente el navegador con el reporte detallado.


ESTRUCTURA DEL PROYECTO:
------------------------

tests/
  ├── data/csv/              - Datos externos en formato CSV
  │   ├── bills.csv          - Datos de facturación (3 escenarios)
  │   ├── products.csv       - Pares de productos (3 combinaciones)
  │   └── users.csv          - Datos de usuarios
  │
  ├── e2e/
  │   └── shopping.spec.ts   - Test principal del flujo de compra
  │
  ├── pages/                 - Page Object Model (POM)
  │   ├── base.page.ts       - Clase base con métodos comunes
  │   ├── buy.page.ts        - Página de compra
  │   └── login.page.ts      - Página de login
  │
  └── interfaces/            - Definiciones de tipos TypeScript

src/
  └── csv-reader.ts          - Utilidad para leer archivos CSV

playwright.config.ts         - Configuración de Playwright
tsconfig.json                - Configuración de TypeScript


DESCRIPCIÓN DEL TEST:
--------------------

El test implementado (shopping.spec.ts) realiza lo siguiente:

1. Navega a https://www.demoblaze.com/
2. Agrega el primer producto al carrito (verificando respuesta HTTP 200)
3. Vuelve al Home
4. Agrega el segundo producto al carrito (verificando respuesta HTTP 200)
5. Navega al carrito y verifica que ambos productos sean visibles
6. Completa el formulario de compra con datos del CSV
7. Verifica que todos los campos se completaron correctamente
8. Finaliza la compra haciendo clic en "Purchase"
9. Verifica el mensaje de éxito "Thank you for your purchase!"


ESCENARIOS EJECUTADOS:
---------------------

El test genera 3 escenarios automáticamente desde archivos CSV:

- Escenario 1: Samsung galaxy s7 + Sony vaio i5 (datos de Camilo)
- Escenario 2: Nokia lumia 1520 + Nexus 6 (datos de Ana Garcia)
- Escenario 3: Samsung galaxy s6 + Sony xperia z5 (datos de John Smith)

Esto simula un enfoque "Data-Driven Testing" similar a Scenario Outline
de Cucumber/BDD.


PATRÓN DE DISEÑO IMPLEMENTADO:
------------------------------

Page Object Model (POM):
- BasePage: Clase base con métodos reutilizables (safeClick, safeFill, 
  waitForElement) que validan visibilidad antes de actuar
- BuyPage: Hereda de BasePage, contiene localizadores y métodos específicos
  para el flujo de compra
- LoginPage: Hereda de BasePage, maneja el login de usuarios


MANEJO DE ERRORES:
------------------

El proyecto implementa:
- Validación de visibilidad antes de cada interacción
- Mensajes descriptivos en todos los expect()
- Validación de respuestas HTTP en las llamadas a API
- Validación de existencia y formato en archivos CSV
- Timeouts configurables


MODIFICAR DATOS DE PRUEBA:
-------------------------

Para cambiar los datos de prueba, edita los archivos CSV en tests/data/csv/:

1. bills.csv - Agregar/modificar datos de facturación
   Formato: name,country,city,creditCard,month,year

2. products.csv - Agregar/modificar pares de productos
   Formato: product1,product2

3. users.csv - Agregar/modificar usuarios
   Formato: username,password

Los tests se ejecutarán automáticamente con todos los datos del CSV.


SOLUCIÓN DE PROBLEMAS:
---------------------

1. Error "Cannot find module @playwright/test":
   - Ejecutar: npm install

2. Error "Browsers not installed":
   - Ejecutar: npx playwright install

3. Tests fallan por timeout:
   - Verificar conexión a internet
   - Aumentar timeout en playwright.config.ts

4. Error de navegación a demoblaze.com:
   - Verificar que https://www.demoblaze.com esté accesible
   - Verificar configuración de baseURL en playwright.config.ts


CONTACTO:
---------

Para más información sobre Playwright:
https://playwright.dev/

===============================================================================
sd