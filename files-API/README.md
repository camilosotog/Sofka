# API Tests - Demoblaze

Este directorio contiene las pruebas automatizadas para los endpoints de API de Demoblaze usando **Playwright** con **TypeScript**.

---

## Estructura de Pruebas

La carpeta `tests/api/` contiene los archivos de prueba:

```
tests/
└── api/
    └── petstore.spec.ts         # Tests de API del PetStore
```

---

## Requisitos

- Node.js (versión 18+)
- npm instalado
- Playwright instalado (incluido en devDependencies)

---

## Instalación

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```

---

## Cómo Ejecutar las Pruebas

### Ejecutar pruebas de API específicas

```bash
npm run test:api
```

### Ejecutar todas las pruebas de API

```bash
npm run test:api:all
```

### Ejecutar pruebas con reportes

```bash
npm run test:api:report
```

### Ejecutar en modo UI (interactivo)

```bash
npm run test:ui
```

### Ejecutar en modo debug

```bash
npm run test:debug
```

---

## Estructura de las Pruebas

Los tests están organizados con la siguiente estructura:

- **petstore.spec.ts** - Tests de endpoints de API del PetStore
  - Validaciones de status HTTP
  - Validación de estructura de respuesta
  - Validación de datos en respuesta
  - Manejo de errores

---

## Reportes

Los reportes se generan automáticamente en:

- **playwright-report/** - Reporte HTML interactivo
- **test-results/results.json** - Resultados en formato JSON

Para visualizar el reporte HTML:

```bash
npm run report
```

---

## Base URL

La base URL está configurada en `playwright.config.ts`:

```
https://www.demoblaze.com
```

---
