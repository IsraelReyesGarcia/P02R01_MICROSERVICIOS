using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EPPP_INVENTARIO_API.Models
{
    [Table("Productos")]
    public class Producto
    {
        [Key]
        public int ProductoId { get; set; }
        public int CategoriaId { get; set; }
        [ForeignKey(nameof(CategoriaId))]
        public Categoria? Categoria { get; set; }
        [MaxLength(20)]
        public string Codigo { get; set; } = string.Empty;
        [MaxLength(150)]
        public string Nombre { get; set; } = string.Empty;
        [MaxLength(500)]
        public string? Descripcion { get; set; }
        [MaxLength(100)]
        public string? Marca { get; set; }
        [MaxLength(20)]
        public string? Talla { get; set; }
        public int StockActual { get; set; }
        public int StockMaximo { get; set; }
        [Column(TypeName = "decimal(10,2)")]
        public decimal? Precio { get; set; }
        public bool Activo { get; set; } = true;
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
    }
}
