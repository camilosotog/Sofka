import http from 'k6/http';
import { check } from 'k6';
import exec from 'k6/execution';

// Test de CARGA FIJA - 1500 usuarios por 30 segundos
// Evalúa estabilidad del endpoint con carga constante

// Contador global de fallos
let consecutiveFailures = 0;
let totalRequests = 0;
let failureThreshold = 5; // Número de fallos consecutivos para parar

// Configuración para 1500 usuarios fijos durante 30 segundos
export const options = {
  stages: [
    { duration: '10s', target: 1500 }, // Ramp-up rápido a 1500 usuarios
    { duration: '30s', target: 1500 }, // Mantener 1500 usuarios fijos
    { duration: '5s', target: 0 },     // Ramp-down rápido
  ],
  // Thresholds permisivos para detectar punto de quiebre
  thresholds: {
    http_req_failed: ['rate<0.95'], // Permitir hasta 95% de fallos
    http_req_duration: ['p(50)<30000'], // 50% bajo 30s (muy permisivo)
  },
};

// URL y configuración del endpoint
const BASE_URL = 'https://tapq6jz535.execute-api.us-east-1.amazonaws.com';
const LOGIN_ENDPOINT = '/preproduccion/ms-authentication/v1/user/login';

// Headers comunes
const headers = {
  'accept': 'application/json',
  'accept-language': 'es-ES,es;q=0.9',
  'authorization-method': 'DEFAULT',
  'content-type': 'application/json',
  'oncredit-api-token': 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyQWdlbnQiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTQzLjAuMC4wIFNhZmFyaS81MzcuMzYiLCJ0ZW5hbnQiOiJ5YW0tcHJlIiwic2lnbmVyIjoiZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnphV2R1WlhJaU9pSnZibU55WldScGREcHRjeTFoZFhSb1pXNTBhV05oZEdsdmJpSXNJbWxoZENJNk1UYzJPVE15TWpRM055d2laWGh3SWpveE56WTVNek16TWpjM2ZRLlZDTHpjQVR0RW1VUjNaVF9WMjVQWnNhNk4xUWJ3cnYtNDVKVng1OEQ5SlpzV212NTNFY3VIUmR4VzZWeTRITnJ2MmtfdWZUbUU0Vlg2VE9VbkZaNG9BIiwib3JpZ2luIjoiaHR0cHM6Ly9vbmNyZWRpdHYzLXByZXByb2R1Y2Npb24teWFtYWhhLmNveHRpLmNvbSIsImlhdCI6MTc2OTMyMjQ3NywiZXhwIjoxNzY5MzMzMjc3fQ.bFSros1syv4izt0m8kK0hik2mRVe4pKQg_XZ0u6t_Fve507zRhw4xortm6XMyBMLMByZI4OZoP-ykOjta4oVEw',
  'origin': 'https://oncreditv3-preproduccion-yamaha.coxti.com',
  'priority': 'u=1, i',
  'referer': 'https://oncreditv3-preproduccion-yamaha.coxti.com/',
  'sec-ch-ua': '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'tenant': 'yam-pre',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
  'x-oncredit-secure': 'true'
};

// Datos de login
const loginData = {
  email: "admin1@coxti.com",
  password: "!QAZxsw2"
};

// Función principal con detección automática de punto de quiebre
export default function () {
  totalRequests++;
  
  // Realizar petición de login
  const response = http.post(
    `${BASE_URL}${LOGIN_ENDPOINT}`,
    JSON.stringify(loginData),
    { headers: headers }
  );

  const isSuccess = response.status === 200;
  const currentTime = new Date().toISOString().substr(11, 12);
  const activeVUs = exec.instance.vusActive;
  
  // Calcular usuarios por segundo aproximado
  const rps = activeVUs; // Aproximación: VUs activos ≈ requests por segundo
  
  // Verificación y conteo de fallos
  check(response, {
    'Status 200 (Success)': (r) => r.status === 200,
    'No timeout': (r) => r.timings.duration < 30000,
  });

  // Lógica de detección de punto de quiebre
  if (!isSuccess) {
    consecutiveFailures++;
    console.log(`🚨 [${currentTime}] FALLO #${consecutiveFailures} - VUs:${activeVUs} (~${rps} req/s) | Status:${response.status} | ${response.timings.duration.toFixed(0)}ms`);
    
    // PARAR TEST cuando se detecten fallos consecutivos
    if (consecutiveFailures >= failureThreshold) {
      console.log('');
      console.log('🛑 ===== PUNTO DE QUIEBRE DETECTADO =====');
      console.log(`💥 FALLA CON: ${activeVUs} usuarios virtuales`);
      console.log(`⚡ APROXIMADAMENTE: ${rps} peticiones por segundo`);
      console.log(`📊 Status de falla: ${response.status}`);
      console.log(`⏱️  Tiempo de respuesta: ${response.timings.duration.toFixed(0)}ms`);
      console.log(`🔢 Total peticiones realizadas: ${totalRequests}`);
      console.log('🛑 PARANDO TEST AUTOMÁTICAMENTE...');
      console.log('');
      
      // Parar la ejecución del test
      exec.test.abort('Punto de quiebre detectado - Test detenido automáticamente');
    }
  } else {
    // Reset contador si hay éxito
    if (consecutiveFailures > 0) {
      console.log(`✅ [${currentTime}] RECUPERACIÓN - VUs:${activeVUs} (~${rps} req/s) | Status:${response.status} | ${response.timings.duration.toFixed(0)}ms`);
    }
    consecutiveFailures = 0;
  }

  // Log periódico del progreso
  if (__ITER % 50 === 0) {
    console.log(`📊 [${currentTime}] VUs:${activeVUs} (~${rps} req/s) | Status:${response.status} | ${response.timings.duration.toFixed(0)}ms | ${isSuccess ? '✅' : '❌'}`);
  }
}

// Función de configuración inicial
export function setup() {
  console.log('🎯 TEST DE CARGA FIJA - 1500 USUARIOS');
  console.log('📊 Configuración:');
  console.log('   - Usuarios fijos: 1500 VUs');
  console.log('   - Duración de carga: 30 segundos');
  console.log('   - Duración total: ~45 segundos');
  console.log('   - AUTO-STOP: Tras 5 fallos consecutivos');
  console.log('   - Objetivo: Evaluar estabilidad con carga fija');
  console.log('   - Tenant: yam-pre');
  console.log('');
  console.log('⚡ Evaluando rendimiento con 1500 usuarios constantes...');
  console.log('📈 Monitoreando tasa de éxito y tiempos de respuesta');
  console.log('');
}

// Función de limpieza final
export function teardown(data) {
  console.log('');
  console.log('🏁 TEST AUTO-STOP COMPLETADO');
  console.log('📈 Resultado esperado:');
  console.log('   - Test parado automáticamente al detectar fallas');
  console.log('   - Número exacto de usuarios/segundo que causó falla');
  console.log('   - Status code del punto de quiebre');
  console.log('📊 Revisa el reporte JSON para métricas detalladas');
}
