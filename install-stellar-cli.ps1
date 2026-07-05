# Install Stellar CLI on Windows
# Run this script first before deploying contracts

Write-Host "🌟 Stellar CLI Installation Script" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$STELLAR_DIR = "C:\stellar"
$STELLAR_EXE = "$STELLAR_DIR\stellar.exe"

# Check if already installed
if (Test-Path $STELLAR_EXE) {
    Write-Host "✅ Stellar CLI already installed at: $STELLAR_EXE" -ForegroundColor Green
    $version = & $STELLAR_EXE --version
    Write-Host "Version: $version" -ForegroundColor Cyan
    Write-Host ""
    $reinstall = Read-Host "Do you want to reinstall? (y/N)"
    if ($reinstall -ne "y" -and $reinstall -ne "Y") {
        Write-Host "Using existing installation." -ForegroundColor Green
        exit 0
    }
}

Write-Host "Downloading Stellar CLI..." -ForegroundColor Yellow

# Create directory
New-Item -ItemType Directory -Force -Path $STELLAR_DIR | Out-Null

# Get latest release URL
$REPO = "stellar/stellar-cli"
$RELEASE_URL = "https://api.github.com/repos/$REPO/releases/latest"

try {
    Write-Host "Fetching latest release information..." -ForegroundColor Cyan
    $release = Invoke-RestMethod -Uri $RELEASE_URL
    $version = $release.tag_name
    
    Write-Host "Latest version: $version" -ForegroundColor Green
    
    # Find Windows MSVC asset
    $asset = $release.assets | Where-Object { $_.name -like "*x86_64-pc-windows-msvc*" }
    
    if (-not $asset) {
        Write-Host "❌ Windows binary not found in release!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please download manually from:" -ForegroundColor Yellow
        Write-Host "https://github.com/$REPO/releases/latest" -ForegroundColor Cyan
        exit 1
    }
    
    $downloadUrl = $asset.browser_download_url
    $fileName = $asset.name
    $downloadPath = "$env:TEMP\$fileName"
    
    Write-Host "Downloading: $fileName" -ForegroundColor Cyan
    Invoke-WebRequest -Uri $downloadUrl -OutFile $downloadPath
    
    Write-Host "✅ Download complete" -ForegroundColor Green
    Write-Host ""
    
    # Extract based on file type
    Write-Host "Extracting..." -ForegroundColor Yellow
    
    if ($fileName -like "*.tar.gz") {
        # Extract tar.gz
        tar -xzf $downloadPath -C $STELLAR_DIR
        
        # Find the stellar.exe in extracted files
        $stellarExe = Get-ChildItem -Path $STELLAR_DIR -Filter "stellar.exe" -Recurse | Select-Object -First 1
        if ($stellarExe) {
            Move-Item $stellarExe.FullName $STELLAR_EXE -Force
        }
    }
    elseif ($fileName -like "*.zip") {
        # Extract zip
        Expand-Archive -Path $downloadPath -DestinationPath $STELLAR_DIR -Force
        
        # Find the stellar.exe in extracted files
        $stellarExe = Get-ChildItem -Path $STELLAR_DIR -Filter "stellar.exe" -Recurse | Select-Object -First 1
        if ($stellarExe) {
            Move-Item $stellarExe.FullName $STELLAR_EXE -Force
        }
    }
    
    # Clean up any extra directories
    Get-ChildItem -Path $STELLAR_DIR -Directory | Remove-Item -Recurse -Force
    
    Write-Host "✅ Extraction complete" -ForegroundColor Green
    Write-Host ""
    
} catch {
    Write-Host "❌ Error downloading Stellar CLI" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Please download manually:" -ForegroundColor Yellow
    Write-Host "1. Visit: https://github.com/$REPO/releases/latest" -ForegroundColor Cyan
    Write-Host "2. Download: stellar-cli-*-x86_64-pc-windows-msvc.tar.gz" -ForegroundColor Cyan
    Write-Host "3. Extract stellar.exe to: $STELLAR_DIR" -ForegroundColor Cyan
    exit 1
}

# Add to PATH if not already there
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$STELLAR_DIR*") {
    Write-Host "Adding Stellar CLI to PATH..." -ForegroundColor Yellow
    [Environment]::SetEnvironmentVariable("Path", "$userPath;$STELLAR_DIR", "User")
    $env:Path = "$env:Path;$STELLAR_DIR"
    Write-Host "✅ Added to PATH" -ForegroundColor Green
} else {
    Write-Host "✅ Already in PATH" -ForegroundColor Green
}

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "🎉 Installation Complete!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Verify installation
if (Test-Path $STELLAR_EXE) {
    $version = & $STELLAR_EXE --version
    Write-Host "Stellar CLI Version: $version" -ForegroundColor Cyan
    Write-Host "Location: $STELLAR_EXE" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "✅ You can now run: stellar --version" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Close and reopen PowerShell (to refresh PATH)" -ForegroundColor White
    Write-Host "2. Run: .\deploy-contracts-stellar.ps1" -ForegroundColor White
} else {
    Write-Host "❌ Installation failed - stellar.exe not found" -ForegroundColor Red
}
