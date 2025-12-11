# Static Build Script for nazwa.pl hosting
# This script temporarily moves API routes before static export

Write-Host "[START] Starting static export build..." -ForegroundColor Cyan

# Step 1: Backup API routes
Write-Host "[BACKUP] Backing up API routes..." -ForegroundColor Yellow
if (Test-Path "app/api") {
    if (Test-Path "app-api-backup") {
        Remove-Item -Recurse -Force "app-api-backup"
    }
    Move-Item "app/api" "app-api-backup"
    Write-Host "[OK] API routes backed up to app-api-backup/" -ForegroundColor Green
}

# Step 2: Backup middleware
if (Test-Path "middleware.ts") {
    Move-Item "middleware.ts" "middleware.ts.bak"
    Write-Host "[OK] Middleware backed up" -ForegroundColor Green
}

# Step 2.5: Clean .next cache
Write-Host "[CLEAN] Cleaning .next cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "[OK] .next cache cleaned" -ForegroundColor Green
}

# Step 3: Run static export build
Write-Host "[BUILD] Building static export..." -ForegroundColor Yellow
$env:STATIC_EXPORT = "true"
npm run build

$buildSuccess = $LASTEXITCODE -eq 0

# Step 4: Restore API routes
Write-Host "[RESTORE] Restoring API routes..." -ForegroundColor Yellow
if (Test-Path "app-api-backup") {
    if (Test-Path "app/api") {
        Remove-Item -Recurse -Force "app/api"
    }
    Move-Item "app-api-backup" "app/api"
    Write-Host "[OK] API routes restored" -ForegroundColor Green
}

# Step 5: Restore middleware
if (Test-Path "middleware.ts.bak") {
    Move-Item "middleware.ts.bak" "middleware.ts"
    Write-Host "[OK] Middleware restored" -ForegroundColor Green
}

# Step 6: Copy PHP API to out folder
if ($buildSuccess -and (Test-Path "out")) {
    Write-Host "[COPY] Copying PHP API files to out/..." -ForegroundColor Yellow
    if (Test-Path "public/api") {
        Copy-Item -Recurse "public/api" "out/api" -Force
        Write-Host "[OK] PHP API copied to out/api/" -ForegroundColor Green
    }

    # Copy .htaccess if exists
    if (Test-Path "public/.htaccess") {
        Copy-Item "public/.htaccess" "out/.htaccess" -Force
        Write-Host "[OK] .htaccess copied" -ForegroundColor Green
    }
}

if ($buildSuccess) {
    Write-Host ""
    Write-Host "[SUCCESS] Static export complete! Files are in out folder" -ForegroundColor Green
    Write-Host "[INFO] Upload the out folder contents to nazwa.pl via FTP" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "[ERROR] Build failed!" -ForegroundColor Red
    exit 1
}

