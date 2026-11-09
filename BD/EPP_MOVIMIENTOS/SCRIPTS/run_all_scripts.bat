@echo off
rem This batch file is to run all scripts in the current directory
set local

rem Get the current directory
set "SERVER=ISRAEL"
set "AUTH=-E"
set "SQLCMD=sqlcmd -f 65001"
set "SCRIPTS_DIR=%~dp0"

echo.

echo ==========================================
echo Ejecutando Script 1: Crear base de datos
echo ==========================================

%SQLCMD% -S %SERVER% %AUTH% -C -d master -i "%SCRIPTS_DIR%P02R01_BD_01_CreateDatabase.sql" -b 
if errorlevel 1 goto error 
echo [OK] Script 1 ejecutado con exito

echo . 

echo ======================================
echo Ejecutando Script 2: Crear tablas
echo ======================================

%SQLCMD% -S %SERVER% %AUTH% -C -d master -i "%SCRIPTS_DIR%P02R01_BD_02_CreateTables.sql" -b
if errorlevel 1 goto error
echo [OK] Script 2 ejecutado con exito 

echo .

echo ==============================================
echo Ejecutando Script 3: Realizar carga inicial
echo ==============================================

%SQLCMD% -S %SERVER% %AUTH% -C -d master -i "%SCRIPTS_DIR%P02R01_BD_03_InitialCharge.sql" -b 
if errorlevel 1 goto error 
echo [OK] Script 3 ejecutado con exito

echo .
echo =====================================================
echo EXITO: Todos los scripts se ejecutaron correctamente
echo =====================================================
goto end

:error
echo .
echo =================================================================
echo ERROR: Falló la ejecución del script. Revisa el mensaje anterior
echo =================================================================
endlocal
cmd /k

:end 
endlocal
cmd /k