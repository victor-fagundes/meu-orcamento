@echo off
title Meu Orcamento - dev
cd /d "%~dp0"
echo.
echo  Meu Orcamento - servidor local
echo  Pasta: %CD%
echo  URL:   http://localhost:3000
echo.
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js nao encontrado no PATH. Abra um terminal novo apos instalar o Node.
  pause
  exit /b 1
)
REM mata processo antigo na porta 3000 (evita GET eterno / instancia morta)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
  echo Encerrando PID %%a na porta 3000...
  taskkill /F /PID %%a >nul 2>&1
)
call npm run dev
pause
