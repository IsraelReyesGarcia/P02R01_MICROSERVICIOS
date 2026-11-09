USE EPP_Inventario
GO

/*
PROYECTO: P02R01_BD_IR
AUTOR: ISRAEL REYES
FECHA: 20261108
DESCRIPCIÓN: LIMPIEZA DE DATOS

ORDEN DE LA CONTINGENCIA
	1.Productos
	2.Categorias
*/

-- =====================================
-- Limpieza de tabla [dbo].[Productos]
-- =====================================
BEGIN TRANSACTION;
BEGIN TRY
	IF EXISTS(
		SELECT 1
		FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Productos'
		AND TABLE_SCHEMA = 'dbo'
	)
		BEGIN
			DELETE FROM dbo.Productos;
			PRINT 'Datos de Productos eliminados correctamente'
		END
	ELSE
		BEGIN
			PRINT 'La tabla [dbo].[Productos] no existe'
		END
	COMMIT TRANSACTION;
END TRY
BEGIN CATCH
	IF @@TRANCOUNT > 0
	ROLLBACK TRANSACTION;
	THROW;
END CATCH
GO

-- ================================================
-- Limpieza de tabla [dbo].[Categorias]
-- ================================================
BEGIN TRANSACTION;
BEGIN TRY
	IF EXISTS(
		SELECT 1 
		FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Categorias'
		AND TABLE_SCHEMA = 'dbo'
	)
		BEGIN
			DELETE FROM dbo.Categorias;
			PRINT 'Datos de Categorias eliminados correctamente'
		END
	ELSE
		BEGIN
			PRINT 'La tabla [dbo].[Categorias] no existe'
		END
	COMMIT TRANSACTION;
END TRY
BEGIN CATCH
	IF @@TRANCOUNT > 0
	ROLLBACK TRANSACTION;
	THROW;
END CATCH
GO