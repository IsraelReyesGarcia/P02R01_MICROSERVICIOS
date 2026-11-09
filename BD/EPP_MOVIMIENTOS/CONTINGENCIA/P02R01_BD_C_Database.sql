USE master
GO

/*
PROYECTO: P02R01_BD_IR
AUTOR: ISRAEL REYES
FECHA: 20261109
DESCRIPCIÓN: Eliminar la base de datos
*/

BEGIN TRY
	IF EXISTS(SELECT 1 
		FROM master.dbo.sysdatabases WHERE NAME = N'EPP_Movimientos'
	)
		BEGIN
			-- Cerrar conexiones abiertas de la BD
			ALTER DATABASE EPP_Movimientos SET SINGLE_USER WITH ROLLBACK IMMEDIATE;

			-- Eliminar base de datos EPP_Movimientos
			DROP DATABASE EPP_Movimientos;
			PRINT 'Base de datos EPP_Movimientos eliminada correctamente'
		END
	ELSE
		BEGIN
			PRINT 'La base de datos [EPP_Movimientos] no existe'
		END
END TRY
BEGIN CATCH
	IF EXISTS(SELECT 1 FROM master.dbo.sysdatabases WHERE NAME = N'EPP_Movimientos')
		ALTER DATABASE EPP_Movimientos SET MULTI_USER;
	THROW;
END CATCH
GO