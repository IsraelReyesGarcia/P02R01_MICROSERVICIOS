/*
PROYECTO: B02R02_BD_IS
AURTOR: ISRAEL REYES
FECHA: 20261108
DESCRIPCIÓN: CREAR BASE DE DATOS EPP_Inventario
*/

IF NOT EXISTS (SELECT name FROM master.dbo.sysdatabases where NAME = 'EPP_Inventario' )
	BEGIN
		CREATE DATABASE EPP_Inventario;
		PRINT 'Base de datos EPP_Inventario creada correctamente'
	END
ELSE 
	BEGIN
		PRINT 'La base de datos EPP_Inventario ya existe'
	END
	GO
