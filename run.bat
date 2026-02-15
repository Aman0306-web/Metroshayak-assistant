@echo off
SETLOCAL

:: Navigate to the script directory
CD /D "%~dp0"

ECHO ========================================================
ECHO  DMRC 2026 - AUTO LAUNCHER
ECHO ========================================================

:: Check Python
python --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    ECHO [ERROR] Python not found. Please install Python and add to PATH.
    PAUSE
    EXIT /B
)

:: 1. Start Backend (Runs fix_and_run.py which handles setup + uvicorn)
ECHO.
ECHO [1/2] Starting Backend Server...
START "DMRC Backend API" cmd /k "python fix_and_run.py"

:: 2. Start Frontend (Simple HTTP Server)
ECHO.
ECHO [2/2] Starting Frontend Server...
START "DMRC Frontend UI" cmd /k "python -m http.server 3000"

:: 3. Open Browser
ECHO.
ECHO Launching browser in 5 seconds...
TIMEOUT /T 5 >nul
START http://localhost:3000/index-enhanced.html

ECHO.
ECHO Done! Keep the terminal windows open.
ECHO Press any key to close this launcher...
PAUSE >nul