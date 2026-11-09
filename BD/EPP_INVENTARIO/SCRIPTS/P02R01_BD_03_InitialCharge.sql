USE EPP_Inventario
GO

/*
PROYECTO: B02R02_BD_IS
AURTOR: ISRAEL REYES
FECHA: 20261108
DESCRIPCIÓN: CARGA INICIAL
*/


--=================================
-- INSERT CATEGORIAS
-- Activo y FechaCreacion toman su DEFAULT
--=================================
INSERT INTO dbo.Categorias (Nombre, Descripcion)
VALUES
	(N'Protección de cabeza',       N'Cascos y gorras antigolpes para proteger contra impactos y caída de objetos'),
	(N'Protección ocular',          N'Lentes y goggles contra partículas, polvo y salpicaduras'),
	(N'Protección facial',          N'Caretas y protectores faciales contra impactos y salpicaduras'),
	(N'Protección auditiva',        N'Tapones y orejeras para reducir la exposición al ruido'),
	(N'Protección respiratoria',    N'Mascarillas, respiradores y cartuchos contra polvos, gases y vapores'),
	(N'Protección de manos',        N'Guantes para riesgos mecánicos, químicos y térmicos'),
	(N'Protección de pies',         N'Calzado de seguridad con casquillo y suela antiderrapante'),
	(N'Ropa de trabajo',            N'Overoles, batas y uniformes de trabajo'),
	(N'Protección contra caídas',   N'Arneses, líneas de vida y conectores para trabajos en altura'),
	(N'Alta visibilidad',           N'Chalecos y prendas reflejantes para zonas de tránsito'),
	(N'Protección química',         N'Trajes, mandiles y equipo para manejo de sustancias químicas'),
	(N'Protección térmica',         N'Equipo para trabajos con altas o bajas temperaturas'),
	(N'Protección eléctrica',       N'Guantes dieléctricos y equipo para riesgos eléctricos'),
	(N'Señalización',               N'Conos, cintas y letreros de seguridad'),
	(N'Primeros auxilios',          N'Botiquines y material de atención inmediata'),
	(N'Protección contra lluvia',   N'Impermeables y botas para trabajo en exteriores'),
	(N'Soldadura',                  N'Caretas, mangas y polainas para trabajos de soldadura'),
	(N'Espacios confinados',        N'Detectores de gases y equipo de rescate'),
	(N'Higiene y desechables',      N'Cofias, cubrebocas y batas desechables'),
	(N'Accesorios',                 N'Barbiquejos, porta lentes y refacciones de EPP')
GO

--=================================
-- INSERT PRODUCTOS
-- La categoría se busca por nombre: no depende del IDENTITY(1,2)
--=================================
INSERT INTO dbo.Productos
	(CategoriaId, Codigo, Nombre, Descripcion, Marca, Talla, StockActual, StockMaximo, Precio)
VALUES
	(1,  N'EPP-CAB-001', N'Casco de seguridad tipo I clase E',        N'Casco con suspensión de matraca, dieléctrico',        N'MSA',         N'Unitalla', 25,  50,   289.00),
	(3,  N'EPP-OCU-001', N'Lentes de seguridad claros',               N'Mica antiempañante con protección UV',                N'3M',          N'Unitalla', 80, 150,    65.50),
	(5,  N'EPP-FAC-001', N'Careta facial con visor de policarbonato', N'Visor abatible de 8 pulgadas',                        N'Truper',      N'Unitalla', 15,  30,   185.00),
	(7,  N'EPP-AUD-001', N'Tapones auditivos con cordón',             N'Espuma suave, NRR 29 dB, caja con 100 pares',         N'3M',          N'Unitalla', 40,  60,   420.00),
	(9,  N'EPP-RES-001', N'Respirador N95',                           N'Respirador desechable con válvula de exhalación',     N'3M',          N'Mediana',   0, 100,    48.90),
	(11, N'EPP-MAN-001', N'Guantes de nitrilo anticorte',             N'Nivel de corte A3, recubrimiento en palma',           N'Ansell',      N'M',        60, 120,   135.00),
	(13, N'EPP-PIE-001', N'Bota de seguridad con casquillo',          N'Casquillo de acero, suela antiderrapante',            N'Caterpillar', N'27',       12,  30,  1450.00),
	(15, N'EPP-ROP-001', N'Overol de mezclilla',                      N'Overol industrial con cintas reflejantes',            N'Steelpro',    N'G',        20,  40,   560.00),
	(17, N'EPP-CAI-001', N'Arnés de cuerpo completo',                 N'Arnés con 4 argollas tipo D, ajuste rápido',          N'MSA',         N'Unitalla',  8,  15,  2350.00),
	(19, N'EPP-VIS-001', N'Chaleco de alta visibilidad',              N'Chaleco naranja con cinta reflejante de 2 pulgadas',  N'Truper',      N'G',        50, 100,    95.00),
	(21, N'EPP-QUI-001', N'Traje químico desechable',                 N'Traje con capucha para salpicaduras ligeras',         N'DuPont',      N'XG',       10,  25,   380.00),
	(23, N'EPP-TER-001', N'Guantes de carnaza para calor',            N'Guante largo resistente a altas temperaturas',        N'Truper',      N'Unitalla', 30,  50,   145.00),
	(25, N'EPP-ELE-001', N'Guantes dieléctricos clase 0',             N'Guantes de hule para 1,000 V',                        N'Salisbury',   N'10',        4,  10,  1890.00),
	(27, N'EPP-SEN-001', N'Cono de seguridad de 70 cm',               N'Cono naranja con banda reflejante',                   N'Truper',      NULL,        35,  60,   210.00),
	(29, N'EPP-AUX-001', N'Botiquín industrial',                      N'Botiquín para 25 personas con material básico',       N'Steelpro',    NULL,         6,  12,   990.00),
	(31, N'EPP-LLU-001', N'Impermeable de dos piezas',                N'Chamarra con capucha y pantalón de PVC',              N'Steelpro',    N'G',        18,  40,   320.00),
	(33, N'EPP-SOL-001', N'Careta para soldar fotosensible',          N'Oscurecimiento automático DIN 9 a 13',                N'Lincoln',     N'Unitalla',  5,  10,  1250.00),
	(35, N'EPP-ESP-001', N'Detector de 4 gases',                      N'Mide O2, CO, H2S y gases combustibles',               N'Honeywell',   NULL,         2,   5, 18500.00),
	(37, N'EPP-HIG-001', N'Cofia desechable',                         N'Paquete con 100 cofias de polipropileno',             N'Steelpro',    N'Unitalla', 45,  80,    89.00),
	(39, N'EPP-ACC-001', N'Barbiquejo para casco',                    N'Barbiquejo elástico de 2 puntos',                     N'MSA',         N'Unitalla', 70, 100,    55.00)
GO