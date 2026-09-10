@echo off
echo ===================================================
echo   Starting ClinicDesk Fullstack Clinical Portal
echo ===================================================
echo Starting Backend API (Port 5000)...
start "ClinicDesk Backend" cmd /k "cd /d %~dp0clinic-backend && npm run dev"

timeout /t 2 /nobreak >nul

echo Starting Frontend UI (Port 5173)...
start "ClinicDesk Frontend" cmd /k "cd /d %~dp0\"Clinic Software\" && npm run dev"

echo.
echo ===================================================
echo   ClinicDesk is running!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo ===================================================
