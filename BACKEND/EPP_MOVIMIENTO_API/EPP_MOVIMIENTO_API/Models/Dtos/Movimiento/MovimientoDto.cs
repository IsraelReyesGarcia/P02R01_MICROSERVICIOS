namespace EPP_MOVIMIENTO_API.Models.Dtos.Movimiento
{
    public class MovimientoDto
    {
        public int MovimientoId { get; set; }
        public string TipoMovimiento { get; set; } = string.Empty;
        public int ProductoId { get; set; }
        public string ProductoNombre { get; set; } = string.Empty;
        public int? EmpleadoId { get; set; }
        public string EmpleadoNombre { get; set; } = string.Empty;
        public string EmpleadoNumero { get; set; } = string.Empty;
        public int Cantidad { get; set; }
        public string Motivo { get; set; } = string.Empty;
        public DateTime FechaMovimiento { get; set; }
        public string Registrador { get; set; } = string.Empty;
    }
}
