@echo off
rem This batch file is used to run all scripts in the currency directory.
setlocal

rem Get current directory
set "SERVER=ISRAEL"
set "AUTH=-E"
set "SQLCMD=sqlcmd -f 65001"
set "SCRIPTS_DIR=%~dp0"

echo .
echo ============================================
echo Ejecutando Script 1: Crear la base de datos
echo =============================================

%SQLCMD% -S %SERVER% %AUTH% -C -d master -i "%SCRIPTS_DIR%P02R01_BD_01_CreateDatabase.sql" -b
if errorlevel 1 goto error
echo [OK] Script 1 ejecutado con exito

rem Cambia por el nombre de la base de datos en el script
set "DB=EPP_Inventario"

echo .

echo =============================================
echo Ejecutando Script 2: Crear tablas
echo =============================================

%SQLCMD% -S %SERVER% %AUTH% -C -d %DB% -i "%SCRIPTS_DIR%P02R01_BD_02_CreateTable.sql" -b
if errorlevel 1 goto error
echo [OK] Script 2 ejecutado con exito

echo .

echo ==============================================
echo Ejecutando Script 3: Carga inicial
echo ==============================================

%SQLCMD% -S %SERVER% %AUTH% -C -d %DB% -i "%SCRIPTS_DIR%P02R01_BD_03_InitialCharge.sql" -b
if errorlevel 1 goto error
echo [OK] Script 3 ejecutado con exito

echo.
echo ====================================================
echo EXITO: Todos los scripts se ejectuaron correctamente
echo =====================================================
goto end 

:error
echo .
echo =====================================================
echo ERROR: Fallo la ejecución del script. Revisa el mensaje anterior.
echo =====================================================
endlocal
cmd /k

:end
endlocal
cmd /k