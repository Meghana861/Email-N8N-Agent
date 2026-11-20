@echo off
echo Starting Meeting Minutes Generator Services...
echo.

echo Starting n8n server...
start "n8n Server" cmd /k "cd /d "%~dp0" && n8n start"

echo Waiting for n8n to start...
timeout /t 5

echo Starting frontend...
start "Frontend Server" cmd /k "cd /d "%~dp0meeting-minutes-frontend" && npm run dev"

echo.
echo Services started:
echo - n8n: http://localhost:5678
echo - Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul
