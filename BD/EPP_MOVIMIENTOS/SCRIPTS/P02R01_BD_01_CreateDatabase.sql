/*
PROYECTO: CREAR BASE DE DATOS EPP_Movimientos PARA UN SAAS CON MICROSERVICIOS
AUTOR: ISRAEL REYES
FECHA: 20261108
DESCRIPCI�N: CREAR BASE DE DATOS
*/

	
IF NOT EXISTS (SELECT name FROM master.dbo.sysdatabases WHERE NAME = 'EPP_Movimientos')
	BEGIN
		CREATE DATABASE EPP_Movimientos
		PRINT 'La base de datos EPP_Movimiento se creo exitosamente'
	END
ELSE
	BEGIN
		PRINT 'La base de datos [EPP_Movimientos] ya existe'
	END
GO