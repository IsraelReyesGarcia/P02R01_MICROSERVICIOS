using System.ComponentModel.DataAnnotations;

namespace EPPP_INVENTARIO_API.Models.Dtos.Categoria
{
    public class CategoriaDto
    {
        public int CategoriaId { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public bool Activo { get; set; }
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
    }
}
