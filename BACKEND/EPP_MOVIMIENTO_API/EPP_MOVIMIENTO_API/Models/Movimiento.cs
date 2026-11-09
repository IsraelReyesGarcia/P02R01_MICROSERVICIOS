using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EPP_MOVIMIENTO_API.Models
{
    [Table("Movimientos")]
    public class Movimiento
    {
        [Key]
        public int MovimientoId { get; set; }
        [MaxLength(20)]
        public string TipoMovimiento { get; set; } = string.Empty;
        public int ProductoId { get; set; }
        [MaxLength(150)]
        public string ProductoNombre { get; set; } = string.Empty;
        public int? EmpleadoId { get; set; }
        [ForeignKey(nameof(EmpleadoId))]
        public Empleado? Empleado { get; set; }
        public int Cantidad { get; set; }
        [MaxLength(255)]
        public string? Motivo { get; set; }
        public DateTime FechaMovimiento { get; set; } = DateTime.Now;
        [MaxLength(100)]
        public string? Registrador { get; set; }
    }
}
