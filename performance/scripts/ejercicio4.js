/**
 * 📝 Ejercicio 4 - Custom Metrics para Microservicio de Autenticación
    Contexto
    Un equipo de arquitectura quiere saber hasta dónde escala un nuevo microservicio de autenticación.
    Requerimiento
    •	El tráfico debe incrementarse progresivamente
    •	Se debe identificar el punto donde:
    o	la latencia se dispara
    o	los errores aumentan
    •	No hay un SLA definido aún
    
    🎯 OBJETIVOS CON CUSTOM METRICS:
    •	Medir latencia específica de autenticación
    •	Contar intentos de login exitosos vs fallidos  
    •	Detectar degradación progresiva del servicio
    •	Identificar el punto de quiebre con métricas personalizadas

 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Gauge, Rate, Trend } from 'k6/metrics';

// 📊 CUSTOM METRICS ESPECÍFICAS PARA AUTENTICACIÓN
// =================================================

// Contadores para análisis de autenticación
const authAttempts = new Counter('auth_attempts_total');
const authSuccessful = new Counter('auth_successful_total');
const authFailures = new Counter('auth_failures_total');
const serverErrors = new Counter('server_errors_5xx');
const clientErrors = new Counter('client_errors_4xx');

// Rates para medir calidad del servicio
const authSuccessRate = new Rate('auth_success_rate');
const serviceAvailabilityRate = new Rate('service_availability_rate');

// Trends para métricas de rendimiento
const authResponseTime = new Trend('auth_response_time_ms', true);
const authLatencyP95 = new Trend('auth_latency_p95_ms');

// Gauges para monitoreo en tiempo real
const currentLoad = new Gauge('current_concurrent_users');
const errorRateByStage = new Gauge('error_rate_current_stage');

export const options = {
    scenarios: {
        ramping_load: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '10s', target: 50 },   // Carga inicial
                { duration: '10s', target: 100 },  // Incremento moderado
                { duration: '10s', target: 200 },  // Carga media-alta
                { duration: '10s', target: 350 },  // Punto de quiebre esperado
            ]
        }
    },
    // 🎯 THRESHOLDS PERSONALIZADOS PARA CUSTOM METRICS
    thresholds: {
        // Métricas estándar de k6
        'http_req_duration': ['p(95)<2000', 'p(99)<5000'], // Latencia aceptable
        'http_req_failed': ['rate<0.1'],                   // Máximo 10% de errores
        
        // CUSTOM METRICS - Criterios específicos del microservicio
        'auth_success_rate': ['rate>0.95'],               // 95% de autenticaciones exitosas
        'service_availability_rate': ['rate>0.99'],       // 99% de disponibilidad
        'auth_response_time_ms': ['p(95)<1500', 'avg<800'], // Tiempo de respuesta autenticación
        'server_errors_5xx': ['count<20'],                // Máximo 20 errores de servidor
        'client_errors_4xx': ['count<50'],                // Máximo 50 errores de cliente
    },
}

export default function() {
    // 📊 CAPTURA DE MÉTRICAS PRE-REQUEST
    const requestStart = Date.now();
    currentLoad.add(__VU); // Registrar carga actual de usuarios virtuales
    
    const url = 'https://tapq6jz535.execute-api.us-east-1.amazonaws.com/preproduccion/ms-authentication/v1/user/login'
    const payload = JSON.stringify({
        email: 'admin1@coxti.com',
        password: '^!QAZxsw2'
    })

    const params = {
        headers: {
            'accept': 'application/json',
            'accept-language': 'es-ES,es;q=0.9',
            'authorization-method': 'DEFAULT',
            'content-type': 'application/json',
            'oncredit-api-token': 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyQWdlbnQiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTQzLjAuMC4wIFNhZmFyaS81MzcuMzYiLCJ0ZW5hbnQiOiJ5YW0tcHJlIiwic2lnbmVyIjoiZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnphV2R1WlhJaU9pSnZibU55WldScGREcHRjeTFoZFhSb1pXNTBhV05oZEdsdmJpSXNJbWxoZENJNk1UYzJPVE0zTlRNd05Td2laWGh3SWpveE56WTVNemcyTVRBMWZRLnpRWUo1Wm1zbmwzdzhRaWNSeWlrRzZrbFFlUHJMMXFPeW1JclB3VTJ3V3BNck5kaVUtb1dUTGVwQ3JTaVQtOUY3QWNUNjVlNVpnYW5Gb1JaZjRLQnlnIiwib3JpZ2luIjoiaHR0cHM6Ly9vbmNyZWRpdHYzLXByZXByb2R1Y2Npb24teWFtYWhhLmNveHRpLmNvbSIsImlhdCI6MTc2OTM3NTMwNSwiZXhwIjoxNzY5Mzg2MTA1fQ.vX-TqnzddmgSedbnKE9YFHsGVqDuZV-s1bjWlmb5zcLFv48ClYZYAVOkWnO7R3Obs6yODkrPMipZJE0nVCCtjQ',
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
        },
        timeout: '10s'
    }
    
    // 🚀 EJECUTAR REQUEST DE AUTENTICACIÓN
    const response = http.post(url, payload, params);
    
    // ⏱️ CALCULAR TIEMPO DE RESPUESTA PERSONALIZADO
    const authDuration = Date.now() - requestStart;
    authResponseTime.add(authDuration);
    
    // 📊 REGISTRAR INTENTO DE AUTENTICACIÓN
    authAttempts.add(1);
    
    // ✅ ANÁLISIS DETALLADO DE RESPUESTA
    const authSuccess = check(response, {
        'Auth status is 200': (r) => r.status === 200,
        'Response has token or success indicator': (r) => {
            try {
                const body = r.json();
                return body && (body.token || body.access_token || body.success);
            } catch {
                return false;
            }
        },
        'Response time < 3000ms': (r) => r.timings.duration < 3000,
    });
    
    // 📈 ACTUALIZAR CUSTOM METRICS BASADAS EN RESULTADO
    if (authSuccess) {
        authSuccessful.add(1);
        authSuccessRate.add(true);
    } else {
        authFailures.add(1);
        authSuccessRate.add(false);
        
        // Categorizar tipos de errores
        if (response.status >= 500) {
            serverErrors.add(1);
        } else if (response.status >= 400) {
            clientErrors.add(1);
        }
    }
    
    // 🔍 MÉTRICAS DE DISPONIBILIDAD DEL SERVICIO
    const serviceAvailable = response.status !== 0 && response.status < 500;
    serviceAvailabilityRate.add(serviceAvailable);
    
    // 📊 MONITOREO DE DEGRADACIÓN POR ETAPA
    if (authDuration > 1500) { // Si supera 1.5 segundos
        authLatencyP95.add(authDuration);
    }
    
    // 🚨 DETECCIÓN DE PROBLEMAS DE PERFORMANCE (sin logging)
    if (!authSuccess || authDuration > 2000) {
        // Performance issue detectado - se registra en métricas personalizadas
    }
    
    // 📊 ACTUALIZACIÓN PERIÓDICA DE MÉTRICAS (cada 10% de requests aprox)
    if (Math.random() < 0.1) {
        const currentErrorRate = authAttempts.count > 0 ? (authFailures.count / authAttempts.count) * 100 : 0;
        errorRateByStage.add(currentErrorRate);
    }
}

// 📊 FUNCIÓN DE RESUMEN PERSONALIZADO
export function handleSummary(data) {
    // Calcular métricas derivadas
    const totalRequests = data.metrics.http_reqs?.count || 0;
    const totalAuthAttempts = data.metrics.auth_attempts_total?.count || 0;
    const successfulAuths = data.metrics.auth_successful_total?.count || 0;
    const failedAuths = data.metrics.auth_failures_total?.count || 0;
    
    const breakpointAnalysis = {
        total_requests: totalRequests,
        auth_attempts: totalAuthAttempts,
        success_rate: totalAuthAttempts > 0 ? ((successfulAuths / totalAuthAttempts) * 100).toFixed(2) + '%' : '0%',
        failure_rate: totalAuthAttempts > 0 ? ((failedAuths / totalAuthAttempts) * 100).toFixed(2) + '%' : '0%',
        
        // Análisis de punto de quiebre
        performance_degradation: {
            avg_response_time: data.metrics.auth_response_time_ms?.avg || 0,
            p95_response_time: data.metrics.auth_response_time_ms?.['p(95)'] || 0,
            p99_response_time: data.metrics.auth_response_time_ms?.['p(99)'] || 0,
        },
        
        error_analysis: {
            server_errors_5xx: data.metrics.server_errors_5xx?.count || 0,
            client_errors_4xx: data.metrics.client_errors_4xx?.count || 0,
            service_availability: data.metrics.service_availability_rate?.rate || 0,
        },
        
        // Identificación del punto de quiebre
        breakpoint_indicators: {
            high_latency_requests: data.metrics.auth_latency_p95_ms?.count || 0,
            threshold_violations: {
                response_time: data.metrics.auth_response_time_ms?.['p(95)'] > 1500,
                error_rate: ((failedAuths / totalAuthAttempts) * 100) > 5,
                availability: (data.metrics.service_availability_rate?.rate || 1) < 0.99,
            }
        }
    };

    return {
        'auth-microservice-breakpoint-analysis.json': JSON.stringify({
            test_summary: breakpointAnalysis,
            detailed_metrics: {
                auth_attempts_total: data.metrics.auth_attempts_total,
                auth_successful_total: data.metrics.auth_successful_total,
                auth_failures_total: data.metrics.auth_failures_total,
                auth_success_rate: data.metrics.auth_success_rate,
                auth_response_time_ms: data.metrics.auth_response_time_ms,
                service_availability_rate: data.metrics.service_availability_rate,
                server_errors_5xx: data.metrics.server_errors_5xx,
                client_errors_4xx: data.metrics.client_errors_4xx,
            },
            test_info: {
                timestamp: new Date().toISOString(),
                test_duration: data.state.testRunDurationMs,
                scenarios_executed: Object.keys(data.root_group.groups),
            }
        }, null, 2)
    };
}