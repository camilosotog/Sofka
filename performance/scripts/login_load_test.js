// Módulo HTTP de k6 para hacer peticiones HTTP/HTTPS
import http from 'k6/http';
// check: verifica condiciones (assertions), group: agrupa operaciones relacionadas
import { check, group } from 'k6';
// Rate: métrica para porcentajes (tasa de errores), Trend: métrica para valores numéricos (tiempos)
import { Rate, Trend } from 'k6/metrics';
// Array compartido entre VUs para optimizar memoria
import { SharedArray } from 'k6/data';
// Función para generar reportes HTML al finalizar el test
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

// Métrica personalizada para rastrear el porcentaje de requests fallidos
const errorRate = new Rate('error_rate');
// Métrica personalizada para registrar tiempos de respuesta individuales
const responseTime = new Trend('response_time');

// Crea array compartido (carga una sola vez, memoria eficiente entre todos los VUs)
const csvData = new SharedArray('csv_data', () => {
  // Lee el archivo CSV con las credenciales de usuario
  const csvContent = open('../data/data_test.csv');
  // Divide el contenido por líneas
  const lines = csvContent.split('\n');
  // Array para almacenar los usuarios parseados
  const data = [];
  
  // Itera desde línea 1 (salta el encabezado en línea 0)
  for (let i = 1; i < lines.length; i++) {
    // Limpia espacios en blanco de la línea
    const line = lines[i].trim();
    // Valida que la línea no esté vacía
    if (line && line.length > 0) {
      // Divide la línea por comas (formato CSV)
      const parts = line.split(',');
      // Valida que tenga al menos 2 columnas (user, password)
      if (parts.length >= 2) {
        // Agrega objeto con usuario y contraseña al array
        data.push({
          user: parts[0].trim(),
          passwd: parts[1].trim(),
        });
      }
    }
  }
  
  // Muestra en consola la cantidad de usuarios cargados
  console.log('Usuarios cargados: ' + data.length);
  return data;
});

// Configuración del test de carga
export const options = {
  scenarios: {
    login_load: {
      // Genera iteraciones a tasa constante (no por cantidad de VUs)
      executor: 'constant-arrival-rate',
      // 20 iteraciones por segundo
      rate: 20,
      timeUnit: '1s',
      // El test durará 30 segundos
      duration: '30s',
      // Inicia con 30 VUs preasignados
      preAllocatedVUs: 30,
      // Puede crecer hasta 50 VUs si es necesario para mantener la tasa
      maxVUs: 50,
    },
  },
  // Umbrales que determinan si el test pasa o falla
  thresholds: {
    // El 95% de las peticiones debe completarse en menos de 1500ms
    http_req_duration: ['p(95)<1500'],
    // La tasa de error debe ser menor al 3%
    error_rate: ['rate<0.03'],
  },
};

// Función principal que ejecuta cada usuario virtual (VU) en cada iteración
export default function () {
  // Selecciona un usuario aleatorio del CSV
  const user = csvData[Math.floor(Math.random() * csvData.length)];
  
  // Valida que el usuario tenga datos válidos
  if (!user || !user.user || !user.passwd) {
    console.error('Datos de usuario inválidos');
    return;
  }

  // Prepara el cuerpo del request con las credenciales
  const payload = {
    username: user.user,
    password: user.passwd,
  };

  // Configura los headers y timeout del request
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: '5s',
  };

  // Agrupa todas las operaciones bajo el nombre 'Login Load Test'
  group('Login Load Test', () => {
    // Ejecuta POST al endpoint de login con las credenciales
    const response = http.post(
      'https://fakestoreapi.com/auth/login',
      JSON.stringify(payload),
      params
    );
    
    // Registra el tiempo de respuesta en la métrica personalizada
    responseTime.add(response.timings.duration);
    
    // Verifica 3 condiciones: status OK, tiempo < 1500ms, token presente
    const isSuccess = check(response, {
      'status es 2xx': (r) => r.status >= 200 && r.status < 300,
      'tiempo de respuesta < 1500ms': (r) => r.timings.duration < 1500,
      'respuesta contiene token': (r) => r.body && r.body.includes('token'),
    });

    // Registra en errorRate si falló algún check
    errorRate.add(!isSuccess);
  });
}

// Función ejecutada al finalizar el test para generar reportes personalizados
export function handleSummary(data) {
  return {
    // Genera reporte HTML con todos los resultados en la carpeta reports
    '../reports/login_load_test_report.html': htmlReport(data),
  };
}