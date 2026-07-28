# reset_mysql.ps1 — Run as Administrator
# This script resets the MySQL root password to 'root123'

$myIni = "C:\ProgramData\MySQL\MySQL Server 9.5\my.ini"
$mysqlExe = "C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe"
$newPassword = "root123"

Write-Host "Step 1: Editing my.ini to add skip-grant-tables..." -ForegroundColor Cyan
$content = Get-Content $myIni -Raw
$content = $content -replace '\[mysqld\]', "[mysqld]`r`nskip-grant-tables`r`nskip-networking"
Set-Content $myIni $content -Force
Write-Host "  Done." -ForegroundColor Green

Write-Host "Step 2: Restarting MySQL service..." -ForegroundColor Cyan
Restart-Service -Name "MySQL95" -Force
Start-Sleep -Seconds 3
Write-Host "  Done." -ForegroundColor Green

Write-Host "Step 3: Resetting root password..." -ForegroundColor Cyan
$sql = "FLUSH PRIVILEGES; ALTER USER 'root'@'localhost' IDENTIFIED BY '$newPassword'; FLUSH PRIVILEGES;"
echo $sql | & $mysqlExe -u root --connect-expired-password 2>&1
Write-Host "  Done." -ForegroundColor Green

Write-Host "Step 4: Restoring my.ini (removing skip-grant-tables)..." -ForegroundColor Cyan
$content = Get-Content $myIni -Raw
$content = $content -replace "skip-grant-tables`r`n", ""
$content = $content -replace "skip-networking`r`n", ""
Set-Content $myIni $content -Force
Write-Host "  Done." -ForegroundColor Green

Write-Host "Step 5: Restarting MySQL normally..." -ForegroundColor Cyan
Restart-Service -Name "MySQL95" -Force
Start-Sleep -Seconds 3
Write-Host "  Done." -ForegroundColor Green

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host " MySQL root password reset to: $newPassword" -ForegroundColor Green
Write-Host " Update backend/.env: DB_PASSWORD=$newPassword" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
