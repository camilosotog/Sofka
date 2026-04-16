README - API Tests

Este directorio contiene las pruebas automatizadas para los endpoints de API de Demoblaze usando Postman.

ESTRUCTURA DEL PROYECTO

postman/
  collections/          - Collections de Postman con las pruebas
  environments/         - Configuraciones de entorno (testing)
  globals/              - Variables globales compartidas entre collections

REQUISITOS

- Postman Desktop (ultima versión)
- El repositorio clonado en tu máquina local

INSTALACIÓN

1. Descarga Postman desde https://www.postman.com/downloads/
2. Abre Postman
3. Importa los archivos desde postman/

IMPORTAR EN POSTMAN

Pasos para importar:

1. Abre Postman
2. Haz clic en "Import" (esquina superior izquierda)
3. Selecciona "Files"
4. Ve a la carpeta "postman/collections" y selecciona:
   - Demoblaze - Auth API Tests.postman_collection.json
5. Repite el proceso para importar el entorno en "postman/environments"
6. Repite el proceso para importar los globals en "postman/globals"

CONFIGURACIÓN DE VARIABLES

VARIABLES DE ENTORNO

El archivo test-env.postman_environment.json contiene las siguientes variables:

BASE_URL            - URL base de la API (https://api.demoblaze.com/)
SIGNUP_SCENARIO     - success / error
LOGIN_SCENARIO      - success / error_user / error_pass

Para cambiar estas variables:

1. En Postman, ve a "Environments" (lado izquierdo)
2. Selecciona "test-env" 
3. Modifica los valores según necesites:
   - Haz clic en la variable para editarla
   - Ingresa el nuevo valor en la columna "INITIAL VALUE" o "CURRENT VALUE"
4. Haz clic en "Save" o presiona Ctrl+S

Para desactivar una variable:
- Desmarca el checkbox al lado de su nombre

VARIABLES GLOBALES

El archivo workspace.postman_globals.json contiene variables compartidas que
se aplican a todas las colecciones. Verifica este archivo para ver si hay
variables globales configuradas que necesites usar.

username    - Se genera en los prerequest o postresponse
password    - Se genera en los prerequest o postresponse

Para acceder a las variables globales:
1. En Postman, haz clic en el icono de engranaje (Settings)
2. Ve a la pestaña "Globals"
3. Aquí puedes agregar o modificar variables globales

EJECUTAR LAS PRUEBAS

Opción 1: Ejecución manual en Postman

1. Abre la collection "Demoblaze - Auth API Tests"
2. Selecciona el entorno "test-env" en el dropdown superior derecho
3. Expande las carpetas para ver las peticiones
4. Haz clic en cualquier petición y presiona "Send"

Opción 2: Ejecutar toda la colección

1. Haz clic derecho en la collection "Demoblaze - Auth API Tests"
2. Selecciona "Run collection"
3. Asegúrate de que el entorno "test-env" está seleccionado
4. Haz clic en "Run Demoblaze - Auth API Tests"
5. Se abrirá una ventana con los resultados de todas las pruebas

Opción 3: Ejecución mediante Newman (CLI)

Newman es la herramienta de línea de comandos de Postman.

Instalación:
npm install -g newman

Ejecutar pruebas:
newman run postman/collections/Demoblaze\ -\ Auth\ API\ Tests.postman_collection.json \
  -e postman/environments/test-env.postman_environment.json \
  -g postman/globals/workspace.postman_globals.json

REPORTES DE NEWMAN

Para generar reportes HTML visuales con Newman, instala el reporter htmlextra:

Instalación del reporter HTML:
npm install -g newman-reporter-htmlextra

Generar reporte HTML:
newman run "postman/collections/Demoblaze - Auth API Tests.postman_collection.json" ^
  -e "postman/environments/test-env.postman_environment.json" ^
  -g "postman/globals/workspace.postman_globals.json" ^
  -r htmlextra ^
  --reporter-htmlextra-export "reports/demoblaze-report.html" ^
  --reporter-htmlextra-title "Demoblaze API Tests Report"

Generar reporte JSON
newman run "postman/collections/Demoblaze - Auth API Tests.postman_collection.json" ^
  -e "postman/environments/test-env.postman_environment.json" ^
  -g "postman/globals/workspace.postman_globals.json" ^
  -r json ^
  --reporter-json-export "reports/results.json"

Los reportes se guardan en la carpeta reports/

ESTRUCTURA DE LAS PRUEBAS

Cada petición contiene:

Pre-request Script - Código que se ejecuta antes de enviar la petición
  - Configura valores dinámicos
  - Prepara datos para la petición
  - Valida estado anterior

Tests - Validaciones que se ejecutan después de recibir la respuesta
  - Verifica status HTTP
  - Valida estructura de respuesta
  - Extrae valores para usar en otras peticiones
  - Genera reportes

