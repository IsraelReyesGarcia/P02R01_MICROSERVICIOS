using System.ComponentModel.DataAnnotations;

namespace EPPP_INVENTARIO_API.Models.Dtos.Producto
{
    public class UpdateStockDto
    {
        [Required(ErrorMessage = "El tipo de movimiento es obligatorio")]
        public string TipoMovimiento { get; set; } = string.Empty;
        [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser mayor a 0")]
        public int Cantidad { get; set; }
    }
}
