using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EPP_MOVIMIENTO_API.Models
{
    [Table("Empleados")]
    public class Empleado
    {
        [Key]
        public int EmpleadoId { get; set; }
        [MaxLength(20)]
        public string NumEmpleado { get; set; } = string.Empty;
        [MaxLength(100)]
        public string Nombre { get; set; } = string.Empty;
        [MaxLength(150)]
        public string Apellidos { get; set; } = string.Empty;
        [MaxLength(100)]
        public string? Departamento { get; set; }
        [MaxLength(100)]
        public string? Puesto { get; set; }
        public bool Activo { get; set; } = true;
        public DateTime FechaAlta { get; set; } = DateTime.Now;
    }
}
