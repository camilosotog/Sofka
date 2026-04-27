# Reporte de Prueba de Carga - Login Load Test

**Fecha:** 21 de enero de 2026  
**Herramienta:** k6 (Grafana k6)  
**Endpoint:** https://fakestoreapi.com/auth/login  
**Duración:** 2 minutos (120 segundos)  
**Resultado:** ✅ **EXITOSO**

---

## 📊 Resumen Ejecutivo

Se ejecutó con éxito una prueba de carga integral para evaluar el rendimiento del endpoint de autenticación de la plataforma Demoblaze. La prueba simularó 20 iteraciones por segundo durante 2 minutos, utilizando 5 usuarios de prueba obtenidos de un archivo CSV.

### Resultado General
✅ **TODAS LAS VALIDACIONES CUMPLIDAS**

---

## 📈 Métricas Principales

| Métrica | Valor | Estado |
|---------|-------|--------|
| **Total de Solicitudes** | 2,400 | ✅ 100% exitosas |
| **Tasa de Error** | 0.00% | ✅ Cumple (<3%) |
| **Tiempo Promedio de Respuesta** | 360.91 ms | ✅ Excelente |
| **Tiempo Mínimo** | 321.56 ms | ✅ Óptimo |
| **Tiempo Máximo** | 698.58 ms | ✅ Dentro del rango |
| **Percentil 95** | 392.01 ms | ✅ Cumple (<1500ms) |

---

## ✓ Validaciones de Umbral (Thresholds)

### 1. HTTP Request Duration - Percentil 95
- **Condición:** P95 < 1500 ms
- **Resultado:** 392.01 ms
- **Estado:** ✅ **CUMPLE**

### 2. Error Rate
- **Condición:** Tasa de error < 3%
- **Resultado:** 0.00%
- **Estado:** ✅ **CUMPLE**

---

## ✔️ Validaciones de Checks

| Check | Resultado | Tasa de Éxito |
|-------|-----------|---------------|
| Status es 2xx | 7,200 / 7,200 | ✅ 100% |
| Tiempo de respuesta < 1500ms | 7,200 / 7,200 | ✅ 100% |
| Respuesta contiene token | 7,200 / 7,200 | ✅ 100% |

**Total de Checks Ejecutados:** 7,200  
**Total de Checks Exitosos:** 7,200  
**Total de Checks Fallidos:** 0  

---

## 📊 Estadísticas Detalladas de Tiempo de Respuesta

```
Métrica           Valor
─────────────────────────
Promedio (avg)    360.91 ms
Mínimo (min)      321.56 ms
Mediana (med)     357.27 ms
Máximo (max)      698.58 ms
Percentil 90      380.47 ms
Percentil 95      392.01 ms
```

---

## 🌐 Consumo de Red

| Recurso | Cantidad | Promedio |
|---------|----------|----------|
| **Datos Recibidos** | 1.5 MB | 12 kB/s |
| **Datos Enviados** | 324 kB | 2.7 kB/s |
| **Total Transferido** | 1.824 MB | - |

---

## ⚙️ Configuración de Ejecución

### Escenario de Carga
- **Tipo de Ejecutor:** constant-arrival-rate
- **Tasa de Llegada:** 20 iteraciones por segundo
- **Duración:** 2 minutos
- **VUs Prelocalizados:** 30
- **VUs Máximos:** 50

### Usuarios Virtuales Utilizados
| Parámetro | Valor |
|-----------|-------|
| Mínimo | 6 |
| Promedio | 7 |
| Máximo | 14 |
| Máximo Configurado | 30 |

### Configuración de Prueba
- **Usuarios Cargados del CSV:** 5
- **Timeout de Conexión:** 5 segundos
- **Content-Type:** application/json

---

## 🎯 Conclusiones

### ✅ Prueba Completada Exitosamente

#### Puntos Clave

1. **Rendimiento Excepcional**
   - Tiempo promedio de respuesta: **360.91 ms**
   - Muy por debajo del umbral de 1,500 ms
   - Indica un servidor bien optimizado

2. **Confiabilidad Total**
   - 0 errores en 2,400 solicitudes
   - 0% de tasa de error
   - Cumple el umbral <3%

3. **Consistencia Comprobada**
   - P95: 392.01 ms (muy consistente)
   - Rango pequeño entre mín y máx
   - Comportamiento predecible bajo carga

4. **Validaciones 100% Exitosas**
   - ✅ Status HTTP 2xx: 100%
   - ✅ Tiempo de respuesta adecuado: 100%
   - ✅ Tokens en respuesta: 100%

5. **Capacidad de Escalado**
   - Utilizó solo 7 VUs de 30 disponibles
   - Margen significativo para mayor carga
   - Sistema estable y escalable

---

## 📋 Recomendaciones

### ✅ APROBADO PARA PRODUCCIÓN

El endpoint de autenticación está **listo para producción** bajo estas condiciones:

1. ✅ **Monitoreo Continuo**
   - Implementar alertas para tiempo de respuesta
   - Monitorear tasa de error en tiempo real
   - Establecer SLA de 400ms para P95

2. 🔍 **Pruebas Futuras**
   - Realizar pruebas periódicas (cada semana)
   - Aumentar carga graduamente (40, 60, 100 iter/s)
   - Validar comportamiento en picos de tráfico

3. 📊 **Análisis Histórico**
   - Mantener base de datos de resultados
   - Comparar tendencias a lo largo del tiempo
   - Identificar degradación de rendimiento

4. 🔐 **Seguridad**
   - Validar límites de rate limiting
   - Pruebas con patrones maliciosos
   - Validar autenticación bajo carga

---

## 📝 Información Técnica

| Parámetro | Valor |
|-----------|-------|
| **Herramienta** | k6 - Grafana k6 |
| **Endpoint** | https://fakestoreapi.com/auth/login |
| **Método HTTP** | POST |
| **Content-Type** | application/json |
| **Fecha de Ejecución** | 21 de enero de 2026 |
| **Duración Total** | 120 segundos |
| **Tiempo de Ejecución Real** | 2m 00.3s |

---

## 📂 Archivos Generados

Los siguientes reportes se han generado en la carpeta `performance/reports/`:

- `login_load_test_report.html` - Reporte interactivo en HTML
- `test_summary.txt` - Resumen detallado en texto
- `metrics_summary.csv` - Métricas en formato CSV
- `results.json` - Datos brutos en JSON
- `login_load_test_report.md` - Este reporte en Markdown

---

**Reporte Generado:** 21 de enero de 2026  
**Herramienta:** k6 (Grafana k6)  
**Estado:** ✅ COMPLETADO
