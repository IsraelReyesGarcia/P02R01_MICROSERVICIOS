using System.ComponentModel.DataAnnotations;

namespace EPP_MOVIMIENTO_API.Models.Dtos.Movimiento
{
    public class CreateMovimientoDto
    {
        [Required(ErrorMessage = "El tipo de movimiento es obligatorio")]
        [MaxLength(20)]
        public string TipoMovimiento { get; set; } = string.Empty;
        [Range(1, int.MaxValue, ErrorMessage = "El producto es obligatorio")]
        public int ProductoId { get; set; }
        [Required(ErrorMessage = "El nombre del producto es obligatorio")]
        [MaxLength(150)]
        public string ProductoNombre { get; set; } = string.Empty;
        public int? EmpleadoId { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser mayor a 0")]
        public int Cantidad { get; set; }
        [MaxLength(255)]
        public string Motivo { get; set; } = string.Empty;
        [MaxLength(100)]
        public string Registrador { get; set; } = string.Empty;
    }
}
