# Performance Testing - Demoblaze

## Descripción General

Este módulo contiene las pruebas de carga y rendimiento para validar el comportamiento de los endpoints bajo diferentes condiciones de carga. Utilizamos **k6** como herramienta principal para ejecutar las pruebas.

---

## Estructura de Carpetas

```
performance/
├── data/                          # Datos de prueba
│   └── data_test.csv             # Credenciales de usuarios para pruebas
├── scripts/                        # Scripts de prueba k6
│   └── login_load_test.js         # Prueba de carga para endpoint de login
├── reports/                        # Reportes generados
│   ├── login_load_test_report.html    # Reporte interactivo (HTML)
│   ├── login_load_test_report.md      # Reporte en Markdown
│   ├── test_summary.txt               # Resumen detallado (TXT)
│   ├── metrics_summary.csv            # Métricas en CSV
│   └── results.json                   # Datos brutos en JSON
└── README.md                      # Este archivo
```

---

## Requisitos Previos

### Instalación de k6

**En Windows (usando Chocolatey):**

winget install k6 --source winget

---

## Estructura de Datos

### data_test.csv

Archivo CSV que contiene credenciales de usuarios para las pruebas de autenticación.

**Formato:**

```
user,passwd
user1,password1
user2,password2
...
```

**Notas:**

- Primera fila contiene encabezados
- Separador: coma (,)
- El script selecciona usuarios aleatorios durante la ejecución

---

## Usuarios de Prueba

El archivo `data/data_test.csv` contiene los siguientes usuarios:

```
donero:ewedon
kevinryan:kev02937@
johnd:m38rmF$
derek:jklg*_56
mor_2314:83r5^_
```

Estos usuarios son seleccionados aleatoriamente durante la ejecución de las pruebas.

---

## Cómo Ejecutar las Pruebas

### 1. Verificar instalación de k6

```bash
k6 version
```

### 2. Login Load Test (Prueba Principal)

**Ejecutar con reportes básicos:**

```bash
cd performance
k6 run scripts/login_load_test.js
```

**Ejecutar con reportes en JSON:**

```bash
k6 run scripts/login_load_test.js --out json=reports/results.json
```

**Ejecutar con salida HTML (usando extensión k6):**

```bash
k6 run scripts/login_load_test.js --out json=reports/results.json
```

---

## Reportes Generados

Los reportes se guardan en la carpeta `performance/reports/`:

- **login_load_test_report.html** - Reporte interactivo en HTML
- **login_load_test_report.md** - Reporte en formato Markdown
- **test_summary.txt** - Resumen detallado de prueba
- **metrics_summary.csv** - Métricas consolidadas en CSV
- **results.json** - Datos brutos en JSON
- **yamaha_results.json** - Datos de pruebas Yamaha
- **yamaha_breakpoint_autostop.json** - Análisis de punto de ruptura

---

## Nota

Los reportes se incluyen en el repositorio para fines de demostración técnica. Incluyen:

- Métricas de rendimiento de API
- Análisis de puntos de ruptura
- Resultados de pruebas de carga

---
