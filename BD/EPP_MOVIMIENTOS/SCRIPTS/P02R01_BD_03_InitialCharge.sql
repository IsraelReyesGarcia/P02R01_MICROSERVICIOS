USE EPP_Movimientos
GO

/*
PROYECTO: CREAR BASE DE DATOS EPP_Movimientos PARA UN SAAS CON MICROSERVICIOS
AUTOR: ISRAEL REYES
FECHA: 20261108
DESCRIPCIÓN: CREAR BASE DE DATOS
*/


--=================================
-- INSERT EMPLEADOS
--=================================
INSERT INTO dbo.Empleados
	(NumEmpleado, Nombre, Apellidos, Departamento, Puesto, Activo, FechaAlta)
VALUES
	(N'EMP-0001', N'Juan Carlos',   N'Pérez López',        N'Producción',          N'Operador de línea',               1, '2023-02-15'),
	(N'EMP-0002', N'María Fernanda', N'García Ruiz',       N'Almacén',             N'Jefa de almacén',                 1, '2021-06-01'),
	(N'EMP-0003', N'Luis Alberto',  N'Hernández Soto',     N'Mantenimiento',       N'Técnico electricista',            1, '2022-09-12'),
	(N'EMP-0004', N'Ana Sofía',     N'Martínez Díaz',      N'Calidad',             N'Inspectora de calidad',           1, '2023-11-20'),
	(N'EMP-0005', N'Jorge',         N'Ramírez Torres',     N'Seguridad e Higiene', N'Coordinador de seguridad',        1, '2020-03-09'),
	(N'EMP-0006', N'Diana',         N'López Castillo',     N'Producción',          N'Supervisora de turno',            1, '2021-08-23'),
	(N'EMP-0007', N'Ricardo',       N'Sánchez Morales',    N'Mantenimiento',       N'Soldador',                        1, '2022-01-17'),
	(N'EMP-0008', N'Patricia',      N'Flores Jiménez',     N'Logística',           N'Montacarguista',                  1, '2024-04-08'),
	(N'EMP-0009', N'Miguel Ángel',  N'Cruz Vargas',        N'Producción',          N'Operador de línea',               1, '2024-07-01'),
	(N'EMP-0010', N'Laura',         N'Méndez Ortiz',       N'Almacén',             N'Auxiliar de almacén',             1, '2023-05-15'),
	(N'EMP-0011', N'Fernando',      N'Reyes Navarro',      N'Mantenimiento',       N'Técnico mecánico',                1, '2021-10-04'),
	(N'EMP-0012', N'Gabriela',      N'Torres Aguilar',     N'Calidad',             N'Analista de laboratorio',         1, '2022-12-05'),
	(N'EMP-0013', N'Héctor',        N'Domínguez Peña',     N'Logística',           N'Chofer de reparto',               1, '2020-11-16'),
	(N'EMP-0014', N'Claudia',       N'Romero Silva',       N'Seguridad e Higiene', N'Paramédica',                      1, '2023-03-27'),
	(N'EMP-0015', N'Alejandro',     N'Vázquez Ríos',       N'Producción',          N'Operador de máquina',             1, '2024-01-10'),
	(N'EMP-0016', N'Verónica',      N'Gutiérrez Mendoza',  N'Recursos Humanos',    N'Analista de RH',                  1, '2022-06-20'),
	(N'EMP-0017', N'Sergio',        N'Chávez Herrera',     N'Mantenimiento',       N'Técnico en espacios confinados',  1, '2021-04-12'),
	(N'EMP-0018', N'Mónica',        N'Ramos Medina',       N'Producción',          N'Operadora de línea',              1, '2025-02-03'),
	(N'EMP-0019', N'Raúl',          N'Navarro Guerrero',   N'Logística',           N'Jefe de embarques',               0, '2019-09-02'),
	(N'EMP-0020', N'Daniela',       N'Salazar Cruz',       N'Calidad',             N'Inspectora de calidad',           0, '2023-08-14')
GO

--=================================
-- INSERT MOVIMIENTOS
-- Entrada: compra a proveedor (sin empleado, EmpleadoId = NULL)
-- Salida : entrega de EPP a un empleado
-- Registrador: personal de almacén (EMP-0002 y EMP-0010)
--=================================
INSERT INTO dbo.Movimientos
	(TipoMovimiento, ProductoId, ProductoNombre, EmpleadoId, Cantidad, Motivo, FechaMovimiento, Registrador)
VALUES
	(N'Entrada', 1,  N'Casco de seguridad tipo I clase E',  NULL, 30,  N'Compra a proveedor - OC-1001',                    '2026-10-01 09:00', N'María Fernanda García Ruiz'),
	(N'Entrada', 2,  N'Lentes de seguridad claros',         NULL, 100, N'Compra a proveedor - OC-1002',                    '2026-10-01 09:15', N'María Fernanda García Ruiz'),
	(N'Entrada', 6,  N'Guantes de nitrilo anticorte',       NULL, 80,  N'Compra a proveedor - OC-1003',                    '2026-10-02 10:00', N'Laura Méndez Ortiz'),
	(N'Salida',  1,  N'Casco de seguridad tipo I clase E',  1,    1,   N'Entrega por ingreso de personal',                 '2026-10-05 08:30', N'María Fernanda García Ruiz'),
	(N'Salida',  2,  N'Lentes de seguridad claros',         1,    1,   N'Entrega por ingreso de personal',                 '2026-10-05 08:32', N'María Fernanda García Ruiz'),
	(N'Salida',  6,  N'Guantes de nitrilo anticorte',       9,    2,   N'Reposición por desgaste',                         '2026-10-07 07:45', N'Laura Méndez Ortiz'),
	(N'Salida',  13, N'Guantes dieléctricos clase 0',       3,    1,   N'Trabajo en tablero eléctrico',                    '2026-10-08 11:20', N'María Fernanda García Ruiz'),
	(N'Salida',  17, N'Careta para soldar fotosensible',    7,    1,   N'Reposición por daño',                             '2026-10-10 09:10', N'Laura Méndez Ortiz'),
	(N'Salida',  18, N'Detector de 4 gases',                17,   1,   N'Préstamo para trabajo en espacio confinado',      '2026-10-12 06:30', N'María Fernanda García Ruiz'),
	(N'Entrada', 5,  N'Respirador N95',                     NULL, 100, N'Compra a proveedor - OC-1004',                    '2026-10-14 10:30', N'Laura Méndez Ortiz'),
	(N'Salida',  5,  N'Respirador N95',                     15,   5,   N'Trabajo con polvos en línea 2',                   '2026-10-15 08:00', N'Laura Méndez Ortiz'),
	(N'Salida',  10, N'Chaleco de alta visibilidad',        8,    1,   N'Entrega por cambio de área',                      '2026-10-16 12:00', N'María Fernanda García Ruiz'),
	(N'Salida',  9,  N'Arnés de cuerpo completo',           11,   1,   N'Trabajo en altura - mantenimiento de techumbre',  '2026-10-18 07:30', N'María Fernanda García Ruiz'),
	(N'Salida',  4,  N'Tapones auditivos con cordón',       18,   10,  N'Dotación mensual',                                '2026-10-20 08:15', N'Laura Méndez Ortiz'),
	(N'Salida',  7,  N'Bota de seguridad con casquillo',    6,    1,   N'Reposición anual',                                '2026-10-22 09:40', N'María Fernanda García Ruiz'),
	(N'Entrada', 19, N'Cofia desechable',                   NULL, 50,  N'Compra a proveedor - OC-1005',                    '2026-10-25 11:00', N'Laura Méndez Ortiz'),
	(N'Salida',  19, N'Cofia desechable',                   12,   20,  N'Dotación para laboratorio',                       '2026-10-26 08:20', N'Laura Méndez Ortiz'),
	(N'Salida',  15, N'Botiquín industrial',                14,   1,   N'Botiquín para área de producción',                '2026-10-28 10:00', N'María Fernanda García Ruiz'),
	(N'Salida',  8,  N'Overol de mezclilla',                9,    2,   N'Dotación semestral',                              '2026-11-03 08:00', N'Laura Méndez Ortiz'),
	(N'Salida',  12, N'Guantes de carnaza para calor',      7,    2,   N'Trabajos de soldadura',                           '2026-11-05 09:30', N'María Fernanda García Ruiz')
GO
