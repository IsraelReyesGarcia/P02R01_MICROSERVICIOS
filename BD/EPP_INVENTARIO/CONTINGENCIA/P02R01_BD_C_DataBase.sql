USE master
GO

/*
PROYECTO: P02R01_BD_IR
AUTOR: ISRAEL REYES
FECHA: 20261109
DESCRIPCIÓN: ELIMINAR LA BASE DE DATOS
*/

BEGIN TRY
	IF EXISTS(SELECT 1 FROM master.dbo.sysdatabases WHERE name = N'EPP_Inventario')
		BEGIN
			-- Cerrar conexiones abiertas a la base de datos
			ALTER DATABASE EPP_Inventario SET SINGLE_USER WITH ROLLBACK IMMEDIATE

			-- Eliminar base de datos EPP_Inventario
			DROP DATABASE EPP_Inventario;
			PRINT 'Base de datos EPP_Inventario eliminada correctamente.'
		END
	ELSE 
		BEGIN
			PRINT 'La base de datos [EPP_Inventario] no existe.'
		END
END TRY
BEGIN CATCH
	IF EXISTS (SELECT 1 FROM master.dbo.sysdatabases WHERE NAME = N'EPP_Inventario')
		ALTER DATABASE EPP_Inventario SET MULTI_USER;
	THROW;
END CATCH
GO