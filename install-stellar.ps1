# Quick Install Stellar CLI
Write-Host "Installing Stellar CLI..." -ForegroundColor Cyan

$STELLAR_DIR = "C:\stellar"
New-Item -ItemType Directory -Force -Path $STELLAR_DIR | Out-Null

# Download latest release
$url = "https://github.com/stellar/stellar-cli/releases/latest/download/stellar-cli-x86_64-pc-windows-msvc.tar.gz"
$output = "$env:TEMP\stellar-cli.tar.gz"

Write-Host "Downloading..."
Invoke-WebRequest -Uri $url -OutFile $output

Write-Host "Extracting..."
tar -xzf $output -C $STELLAR_DIR

# Add to PATH
$env:Path += ";$STELLAR_DIR"
[Environment]::SetEnvironmentVariable("Path", $env:Path, "User")

Write-Host "✅ Done! Run: stellar --version" -ForegroundColor Green
