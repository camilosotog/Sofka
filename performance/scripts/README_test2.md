# Test de Performance - Login API FakeStore

## Descripción
Este script realiza pruebas de carga al endpoint de autenticación de FakeStore API.

## Requisitos del Test
- **TPS Mínimo**: 20 transacciones por segundo
- **Tiempo de Respuesta**: Máximo 1.5 segundos (p95)
- **Tasa de Error**: Menor al 3%

## Configuración
- **Usuarios de Prueba**:
  - user / passwd
  - donero / ewedon
- **Endpoint**: https://fakestoreapi.com/auth/login
- **Método**: POST
- **Timeout**: 60 segundos

## Ejecutar el Test

### Prerequisitos
Asegúrate de tener k6 instalado:
```bash
# Windows (usando chocolatey)
choco install k6

# O descargar desde https://k6.io/docs/get-started/installation/
```

### Ejecución
```bash
# Ejecutar el test básico
k6 run test2.js

# Ejecutar con reporte HTML
k6 run --out html=../reports/fakestore_login_report.html test2.js

# Ejecutar con múltiples salidas
k6 run --out json=../reports/fakestore_results.json --out html=../reports/fakestore_login_report.html test2.js
```

## Interpretación de Resultados

### Métricas Clave
- **http_reqs**: Número total de peticiones HTTP
- **http_req_duration**: Duración de las peticiones HTTP
- **error_rate**: Tasa de errores personalizada
- **http_req_failed**: Tasa de fallo de peticiones HTTP

### Thresholds Configurados
- `http_req_duration: p(95)<1500ms` - 95% de peticiones bajo 1.5s
- `error_rate: rate<0.03` - Menos del 3% de errores
- `http_reqs: rate>20` - Más de 20 TPS

## Perfil de Carga
1. **Ramp-up**: 2 minutos hasta 25 usuarios virtuales
2. **Steady State**: 5 minutos manteniendo 25 usuarios
3. **Ramp-down**: 2 minutos hasta 0 usuarios

Total de duración: **9 minutos**