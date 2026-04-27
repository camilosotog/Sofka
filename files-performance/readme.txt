================================================================================
                    INSTRUCCIONES DE EJECUCIÓN
                 Prueba de Carga - Login API FakeStore
================================================================================

VERSIONES DE TECNOLOGÍAS
-------------------------
- k6: v0.55.0 (https://github.com/grafana/k6/releases/tag/v0.55.0)
- Node.js: No requerido (k6 es un binario independiente)
- Sistema operativo probado: Windows 10/11

================================================================================
PASO 1 - INSTALAR k6
================================================================================

En Windows (usando winget):
    winget install k6 --source winget

Verificar la instalación:
    k6 version

Resultado esperado:
    k6 v0.55.0 (...)

================================================================================
PASO 2 - CLONAR EL REPOSITORIO
================================================================================

    git clone https://github.com/camilosotog/Sofka.git
    cd Sofka

================================================================================
PASO 3 - VERIFICAR EL ARCHIVO DE DATOS
================================================================================

El archivo de credenciales se encuentra en:
    performance/data/data_test.csv

Contenido del archivo:
    user,passwd
    donero,ewedon
    kevinryan,kev02937@
    johnd,m38rmF$
    derek,jklg*_56
    mor_2314,83r5^_

================================================================================
PASO 4 - EJECUTAR LA PRUEBA DE CARGA
================================================================================

Desde la raíz del repositorio:

    cd performance
    k6 run scripts/login_load_test.js

Para guardar resultados en JSON:

    k6 run scripts/login_load_test.js --out json=reports/results.json

================================================================================
CONFIGURACIÓN DE LA PRUEBA
================================================================================

- Endpoint:         https://fakestoreapi.com/auth/login
- Método:           POST
- TPS objetivo:     20 transacciones por segundo
- Duración:         2 minutos
- VUs preasignados: 30
- VUs máximos:      50

Umbrales (thresholds):
- Tiempo de respuesta p(95) < 1500 ms
- Tasa de error < 3%

================================================================================
PASO 5 - REVISAR LOS REPORTES
================================================================================

Los reportes generados se encuentran en performance/reports/:

- test_summary.txt               → Resumen detallado de la ejecución
- metrics_summary.csv            → Métricas consolidadas en CSV
- results.json                   → Datos brutos en JSON
- login_load_test_report.html    → Reporte interactivo en HTML
- login_load_test_report.md      → Reporte en Markdown

================================================================================
