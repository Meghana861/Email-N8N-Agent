@echo off
echo Setting up Meeting Minutes Generator Frontend...
echo.

cd "c:\Users\Meghana Nemani\Email-Agent\meeting-minutes-frontend"

echo Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install dependencies
    echo Please ensure Node.js and npm are installed
    pause
    exit /b 1
)

echo.
echo Dependencies installed successfully!
echo.
echo Starting development server...
echo The application will open in your browser at http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause
