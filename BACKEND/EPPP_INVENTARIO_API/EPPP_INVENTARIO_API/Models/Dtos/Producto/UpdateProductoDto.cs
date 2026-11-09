using System.ComponentModel.DataAnnotations;

namespace EPPP_INVENTARIO_API.Models.Dtos.Producto
{
    public class UpdateProductoDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "La categoría es obligatoria")]
        public int CategoriaId { get; set; }
        [Required(ErrorMessage = "El código es obligatorio")]
        [MaxLength(20, ErrorMessage = "El código no puede superar 20 caracteres")]
        public string Codigo { get; set; } = string.Empty;
        [Required(ErrorMessage = "El nombre es obligatorio")]
        [MaxLength(150, ErrorMessage = "El nombre no puede superar 150 caracteres")]
        public string Nombre { get; set; } = string.Empty;
        [MaxLength(500)]
        public string Descripcion { get; set; } = string.Empty;
        [MaxLength(100)]
        public string Marca { get; set; } = string.Empty;
        [MaxLength(20)]
        public string Talla { get; set; } = string.Empty;
        [Range(0, int.MaxValue, ErrorMessage = "El stock actual no puede ser negativo")]
        public int StockActual { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "El stock máximo no puede ser negativo")]
        public int StockMaximo { get; set; }
        [Range(0, 99999999.99, ErrorMessage = "El precio no puede ser negativo")]
        public decimal Precio { get; set; }
        public bool Activo { get; set; }
    }
}
