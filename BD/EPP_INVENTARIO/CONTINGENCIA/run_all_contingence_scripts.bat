@echo off
rem This batch file es used to run all scripts in the currency directory
setlocal

rem Get the current director
set "SERVER=ISRAEL"
set "AUTH=-E"
set "SQLCMD=sqlcmd -f 65001"
set "SCRIPTS_DIR=%~dp0"
set "DB=EPP_Inventario"

echo .
echo ===========================================
echo Ejecutando Script 1: Respaldo de los datos
echo ============================================

%SQLCMD% -S %SERVER% %AUTH% -C -d master -i "%SCRIPTS_DIR%P02R01_BD_A_Data.sql" -b 
if errorlevel 1 goto error
echo [OK] Script 1 ejecutado con exito

echo .
echo ============================================
echo Ejecutando Script 2: Respaldo de las tablas
echo ============================================

%SQLCMD% -S %SERVER% %AUTH% -C -d master -i "%SCRIPTS_DIR%P02R01_BD_B_Tables.sql" -b
if errorlevel 1 goto error 
echo [OK] Script 2 ejecutado con exito

echo .
echo =================================================
echo Ejecutando Script 3: Limpieza de la base de datos
echo ==================================================

%SQLCMD% -S %SERVER% %AUTH% -C -d master -i "%SCRIPTS_DIR%P02R01_BD_C_DataBase.sql" -b
if errorlevel 1 goto error
echo [OK] Script 3 ejecutado con exito 

echo .
echo ==================================================
echo EXITO: Todos los scripts se ejecutaron con exito
echo ==================================================
goto end

:error
echo .
echo ================================================================
echo ERROR: Falló la ejecución del script. Revisa el mensaje anterior.
echo ================================================================
endlocal
cmd /k

:end
endlocal 
cmd /k