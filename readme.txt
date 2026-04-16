===============================================================================
                    INSTRUCCIONES DE EJECUCIÓN
         EJERCICIO 1: Prueba E2E - Flujo de Compra en DemoBlaze.com
         EJERCICIO 2: Pruebas de API - PetStore REST Services
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

EJERCICIO 1 - Pruebas E2E:
1. Ejecutar SOLO tests E2E en modo headless:
   npm run test:e2e

2. Ejecutar tests E2E en modo UI interactivo:
   npm run test:ui

3. Ejecutar tests E2E en modo debug:
   npm run test:debug

4. Ejecutar tests E2E con interfaz visible:
   npm run test:headed

EJERCICIO 2 - Pruebas API:
1. Ejecutar SOLO tests de API:
   npm run test:api

AMBOS EJERCICIOS:
1. Ejecutar TODOS los tests (E2E + API):
   npm test

2. Ver reporte HTML de resultados:
   npm run report


VER REPORTES:
-------------

1. Después de ejecutar los tests, ver el reporte HTML:
   npm run report

   Esto abrirá automáticamente el navegador con el reporte detallado.


ESTRUCTURA DEL PROYECTO:
------------------------

tests/
  ├── data/csv/              - Datos externos en formato CSV (E2E)
  │   ├── bills.csv          - Datos de facturación (3 escenarios)
  │   ├── products.csv       - Pares de productos (3 combinaciones)
  │   └── users.csv          - Datos de usuarios
  │
  ├── e2e/                   - EJERCICIO 1: Pruebas E2E
  │   └── shopping.spec.ts   - Test principal del flujo de compra
  │
  ├── api/                   - EJERCICIO 2: Pruebas de API
  │   ├── petstore.spec.ts   - Tests de PetStore API
  │   └── fixtures/
  │       └── pet-data.json  - Datos de prueba para mascotas
  │
  ├── pages/                 - Page Object Model (POM) para E2E
  │   ├── base.page.ts       - Clase base con métodos comunes
  │   ├── buy.page.ts        - Página de compra
  │   └── login.page.ts      - Página de login
  │
  ├── helpers/               - Utilitarios compartidos
  │   └── api-helper.ts      - Helper class para PetStore API
  │
  └── interfaces/            - Definiciones de tipos TypeScript

src/
  └── csv-reader.ts          - Utilidad para leer archivos CSV

playwright.config.ts         - Configuración de Playwright
tsconfig.json                - Configuración de TypeScript
conclusiones-ejercicio2.txt  - Hallazgos del Ejercicio 2 (API)
README-API.md                - Documentación detallada de API tests


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
                         EJERCICIO 2: PRUEBAS DE API
                    REST API Testing - PetStore Swagger
===============================================================================

DESCRIPCIÓN:
-----------
Pruebas automatizadas de servicios REST para la API de PetStore
(https://petstore.swagger.io/) utilizando Playwright APIRequestContext.


CASOS DE PRUEBA IMPLEMENTADOS:
------------------------------

1. ✓ Añadir una mascota a la tienda (POST /pet)
2. ✓ Consultar la mascota ingresada previamente (GET /pet/{petId})
3. ✓ Actualizar el nombre y estatus de la mascota a "sold" (PUT /pet)
4. ✓ Consultar la mascota modificada por estatus (GET /pet/findByStatus)
5. ✓ Flujo completo integrado (todos los pasos anteriores en secuencia)


ESTRUCTURA DEL PROYECTO - API:
-----------------------------

tests/
  └── api/                       - Pruebas de API (Ejercicio 2)
      ├── petstore.spec.ts       - Tests principales de PetStore
      └── fixtures/
          └── pet-data.json      - Datos de prueba para las mascotas

tests/helpers/
  └── api-helper.ts              - Helper class para operaciones PetStore

conclusiones-ejercicio2.txt      - Hallazgos y conclusiones del ejercicio
README-API.md                    - Documentación detallada de pruebas API


EJECUCIÓN DE TESTS DE API:
-------------------------

1. Ejecutar SOLO las pruebas de API:
   npm run test:api

2. Ejecutar SOLO las pruebas E2E:
   npm run test:e2e

3. Ejecutar TODOS los tests (E2E + API):
   npm test

4. Ver reporte HTML de resultados:
   npm run report

5. Modo UI interactivo:
   npm run test:ui


VARIABLES Y DATOS CAPTURADOS:
-----------------------------

Cada test captura y valida:
- petId: ID generado dinámicamente (usando Date.now())
- Response Bodies: Respuestas JSON completas
- Status Codes: Códigos HTTP (200, 404, etc.)
- Headers: Content-Type, etc.

Datos de prueba utilizados:
- Nombres: Firulais, Rex, Bobby, Max
- Estatus: available, pending, sold
- Categoría: Dogs
- Tags y photoUrls de ejemplo


VALIDACIONES IMPLEMENTADAS:
---------------------------

✓ Status codes HTTP (200 para operaciones exitosas)
✓ Estructura de respuesta JSON
✓ Tipos de datos correctos
✓ Valores esperados en campos específicos
✓ Arrays no vacíos
✓ Presencia de campos obligatorios
✓ Consistencia de datos entre operaciones (crear → consultar → actualizar)


ENDPOINTS PROBADOS:
------------------

Base URL: https://petstore.swagger.io/v2

1. POST /pet
   - Crear nueva mascota
   - Input: Objeto Pet con datos completos
   - Output: Pet creada con ID

2. GET /pet/{petId}
   - Consultar mascota por ID
   - Input: ID numérico
   - Output: Objeto Pet completo

3. PUT /pet
   - Actualizar mascota existente
   - Input: Pet con campos modificados
   - Output: Pet actualizada

4. GET /pet/findByStatus?status={status}
   - Buscar mascotas por estatus
   - Input: Status (available, pending, sold)
   - Output: Array de mascotas


HELPER CLASS - PetStoreAPI:
---------------------------

Clase utilitaria que proporciona métodos reutilizables:

- createPet(petData): Crear una mascota
- getPetById(petId): Obtener mascota por ID
- updatePet(petData): Actualizar mascota
- findPetsByStatus(status): Buscar por estatus
- deletePet(petId): Eliminar mascota
- generatePetData(overrides): Generar datos de prueba
- logResponse(title, data): Log formateado


LOGS Y DEBUGGING:
----------------

Los tests incluyen logs detallados en consola:

=== PASO 1: Crear mascota ===
✓ Mascota creada con ID: 1234567890
✓ Nombre: Bobby, Estatus: available

=== PASO 2: Consultar mascota por ID ===
✓ Mascota encontrada: Bobby

=== PASO 3: Actualizar mascota ===
✓ Mascota actualizada: Nombre: Max, Estatus: sold

=== PASO 4: Buscar por estatus "sold" ===
✓ Total mascotas "sold": 45
✓ Nuestra mascota encontrada: Max


POR QUÉ PLAYWRIGHT EN LUGAR DE KARATE:
--------------------------------------

Ventajas de usar Playwright para API Testing:

1. ✓ Integración perfecta: Ya está configurado para E2E
2. ✓ Sin configuración adicional: APIRequestContext nativo
3. ✓ Mismo lenguaje: TypeScript para E2E y API
4. ✓ Reportes unificados: HTML report para ambos tipos de tests
5. ✓ Type Safety: Interfaces TypeScript para mejor mantenimiento
6. ✓ Aserciones integradas: expect() familiar y potente
7. ✓ Manejo automático: Headers, cookies, autenticación


DOCUMENTACIÓN ADICIONAL:
------------------------

- README-API.md: Documentación detallada de pruebas API
- conclusiones-ejercicio2.txt: Hallazgos y conclusiones completas
- Swagger UI: https://petstore.swagger.io/


COMANDOS ÚTILES - API:
---------------------

# Ejecutar un test específico
npx playwright test petstore.spec.ts

# Ejecutar con logs detallados
npx playwright test petstore.spec.ts --debug

# Ver reporte después de ejecutar
npm run report

# Limpiar reportes anteriores (Windows)
rmdir /s /q test-results playwright-report


SOLUCIÓN DE PROBLEMAS - API:
----------------------------

1. Error ECONNREFUSED:
   - Verificar conexión a internet
   - Verificar que https://petstore.swagger.io esté accesible

2. Tests fallan al buscar mascota:
   - Normal: Los tests son independientes
   - Cada test crea sus propios datos

3. IDs duplicados:
   - Se usa Date.now() para generar IDs únicos
   - No deberían haber duplicados en ejecuciones normales

4. API responde lento:
   - Timeouts ya configurados en Playwright
   - Puedes aumentarlos en playwright.config.ts si es necesario


===============================================================================
