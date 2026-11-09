USE EPP_Inventario
GO

-- Comprobar
SELECT * FROM dbo.Categorias;
SELECT * FROM dbo.Productos;

-- Productos con su categoría (deben salir 20)
SELECT p.Codigo, p.Nombre, c.CategoriaId, c.Nombre AS Categoria
FROM dbo.Productos AS p
INNER JOIN dbo.Categorias AS c ON c.CategoriaId = p.CategoriaId;
GO