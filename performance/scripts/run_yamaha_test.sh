#!/bin/bash

# Script para ejecutar test incremental de Yamaha
echo "🚀 Ejecutando test incremental de Yamaha Login API"
echo "================================================="

# Crear directorio de reportes si no existe
mkdir -p ../reports

# Ejecutar test con múltiples salidas
k6 run \
  --out json=../reports/yamaha_results.json \
  --out csv=../reports/yamaha_metrics.csv \
  yamaha_pre.js

# Verificar si el test se ejecutó correctamente
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Test completado exitosamente"
    echo "📁 Reportes generados en: ../reports/"
    echo "   - yamaha_results.json: Datos detallados en JSON"
    echo "   - yamaha_metrics.csv: Métricas en formato CSV"
    echo ""
    echo "🔍 Para generar reporte HTML, ejecuta:"
    echo "   k6-html-reporter --input=../reports/yamaha_results.json --output=../reports/yamaha_report.html"
else
    echo "❌ Error durante la ejecución del test"
    exit 1
fi