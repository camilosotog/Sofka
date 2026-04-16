# Script PowerShell para ejecutar test incremental de Yamaha
Write-Host "🚀 Ejecutando test incremental de Yamaha Login API" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Crear directorio de reportes si no existe
$reportDir = "../reports"
if (-not (Test-Path $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir -Force
    Write-Host "📁 Directorio de reportes creado: $reportDir" -ForegroundColor Yellow
}

# Ejecutar test con múltiples salidas
Write-Host "▶️ Iniciando test de carga..." -ForegroundColor Cyan

$k6Command = "k6 run --out json=../reports/yamaha_results.json --out csv=../reports/yamaha_metrics.csv yamaha_pre.js"
Invoke-Expression $k6Command

# Verificar si el test se ejecutó correctamente
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Test completado exitosamente" -ForegroundColor Green
    Write-Host "📁 Reportes generados en: ../reports/" -ForegroundColor Yellow
    Write-Host "   - yamaha_results.json: Datos detallados en JSON" -ForegroundColor Gray
    Write-Host "   - yamaha_metrics.csv: Métricas en formato CSV" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🔍 Para generar reporte HTML, ejecuta:" -ForegroundColor Cyan
    Write-Host "   k6-html-reporter --input=../reports/yamaha_results.json --output=../reports/yamaha_report.html" -ForegroundColor White
    
    # Intentar abrir el directorio de reportes
    if (Test-Path "../reports") {
        Write-Host "📂 Abriendo directorio de reportes..." -ForegroundColor Cyan
        Start-Process explorer.exe -ArgumentList (Resolve-Path "../reports").Path
    }
} else {
    Write-Host "❌ Error durante la ejecución del test" -ForegroundColor Red
    Write-Host "💡 Verifica que k6 esté instalado y que la URL sea accesible" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🏁 Proceso completado" -ForegroundColor Green