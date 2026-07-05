# StellarGoal Smart Contract Deployment Script (Docker Version)
# Use this if you're having trouble installing Soroban CLI on Windows

Write-Host "🚀 StellarGoal Contract Deployment (Docker)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
Write-Host "Checking Docker installation..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker not found!" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Use Stellar's official Docker image
$SOROBAN_IMAGE = "stellar/quickstart:soroban-dev"

Write-Host "Pulling Stellar Soroban Docker image..." -ForegroundColor Yellow
docker pull $SOROBAN_IMAGE

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "⚠️ MANUAL DEPLOYMENT REQUIRED" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Due to the complexity of contract deployment with Docker," -ForegroundColor Yellow
Write-Host "we recommend using one of these alternatives:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option 1: Install MSVC toolchain" -ForegroundColor Cyan
Write-Host "  rustup toolchain install stable-msvc" -ForegroundColor White
Write-Host "  rustup default stable-msvc" -ForegroundColor White
Write-Host "  cargo install --locked soroban-cli" -ForegroundColor White
Write-Host ""
Write-Host "Option 2: Download pre-built binary" -ForegroundColor Cyan
Write-Host "  Visit: https://github.com/stellar/soroban-tools/releases" -ForegroundColor White
Write-Host "  Download: soroban-cli-*-windows-msvc.zip" -ForegroundColor White
Write-Host "  Extract and add to PATH" -ForegroundColor White
Write-Host ""
Write-Host "Option 3: Use Stellar Laboratory (No CLI needed!)" -ForegroundColor Cyan
Write-Host "  Visit: https://laboratory.stellar.org" -ForegroundColor White
Write-Host "  Deploy contracts through the web interface" -ForegroundColor White
Write-Host ""
