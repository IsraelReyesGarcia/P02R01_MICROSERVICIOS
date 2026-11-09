namespace EPP_MOVIMIENTO_API.Models.Dtos.Empleado
{
    public class EmpleadoDto
    {
        public int EmpleadoId { get; set; }
        public string NumEmpleado { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string Apellidos { get; set; } = string.Empty;
        public string NombreCompleto { get; set; } = string.Empty;
        public string Departamento { get; set; } = string.Empty;
        public string Puesto { get; set; } = string.Empty;
        public bool Activo { get; set; }
        public DateTime FechaAlta { get; set; }
    }
}
