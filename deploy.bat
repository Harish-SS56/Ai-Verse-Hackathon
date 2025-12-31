@echo off
echo ====================================
echo  CareerAI - Vercel Deployment
echo ====================================
echo.

cd /d "%~dp0"

echo Checking Vercel CLI...
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo Vercel CLI not found. Installing...
    npm install -g vercel
)

echo.
echo Building project...
call npm run build

if %errorlevel% neq 0 (
    echo Build failed! Fix errors and try again.
    pause
    exit /b 1
)

echo.
echo Build successful! Starting deployment...
echo.

vercel --prod

echo.
echo ====================================
echo  Deployment Complete!
echo ====================================
echo.
echo Your app is now live on Vercel!
echo.
pause
