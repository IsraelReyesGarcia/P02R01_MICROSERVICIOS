USE EPP_Movimientos
GO

-- Comprobar
SELECT * FROM dbo.Empleados;
SELECT * FROM dbo.Movimientos;

-- Movimientos con el nombre del empleado (las entradas salen con Empleado = NULL)
SELECT m.MovimientoID, m.TipoMovimiento, m.ProductoNombre, m.Cantidad,
	e.NumEmpleado, e.Nombre + N' ' + e.Apellidos AS Empleado, m.FechaMovimiento
FROM dbo.Movimientos AS M
LEFT JOIN dbo.Empleados AS e ON e.EmpleadoId = m.EmpleadoId
ORDER BY m.FechaMovimiento;
GO