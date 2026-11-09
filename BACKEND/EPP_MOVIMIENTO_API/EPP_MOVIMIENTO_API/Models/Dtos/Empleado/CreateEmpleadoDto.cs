using System.ComponentModel.DataAnnotations;

namespace EPP_MOVIMIENTO_API.Models.Dtos.Empleado
{
    public class CreateEmpleadoDto
    {
        [Required(ErrorMessage = "El número de empleado es obligatorio")]
        [MaxLength(20, ErrorMessage = "El número de empleado no puede superar 20 caracteres")]
        public string NumEmpleado { get; set; } = string.Empty;
        [Required(ErrorMessage = "El nombre es obligatorio")]
        [MaxLength(100, ErrorMessage = "El nombre no puede superar 100 caracteres")]
        public string Nombre { get; set; } = string.Empty;
        [Required(ErrorMessage = "Los apellidos son obligatorios")]
        [MaxLength(150, ErrorMessage = "Los apellidos no pueden superar 150 caracteres")]
        public string Apellidos { get; set; } = string.Empty;
        [MaxLength(100)]
        public string Departamento { get; set; } = string.Empty;
        [MaxLength(100)]
        public string Puesto { get; set; } = string.Empty;
        public bool Activo { get; set; } = true;
    }
}
