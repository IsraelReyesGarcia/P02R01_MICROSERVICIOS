namespace EPPP_INVENTARIO_API.Models.Dtos.Producto
{
    public class ProductoDto
    {
        public int ProductoId { get; set; }
        public int CategoriaId { get; set; }
        public string CategoriaNombre { get; set; } = string.Empty;
        public string Codigo { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public string Marca { get; set; } = string.Empty;
        public string Talla { get; set; } = string.Empty;
        public int StockActual { get; set; }
        public int StockMaximo { get; set; }
        public decimal Precio { get; set; }
        public bool Activo { get; set; }
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
    }
}
