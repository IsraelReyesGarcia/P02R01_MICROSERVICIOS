using EPP_MOVIMIENTO_API.Models;

namespace EPP_MOVIMIENTO_API.Repository.IRepository
{
    public interface IMovimientoRepository
    {
        ICollection<Movimiento> GetMovimientos();
        ICollection<Movimiento> GetMovimientosByEmpleado(int empleadoId);
        ICollection<Movimiento> GetMovimientosByProducto(int productoId);
        Movimiento? GetMovimiento(int id);
        bool MovimientoExists(int id);
        bool CreateMovimiento(Movimiento movimiento);
        bool DeleteMovimiento(Movimiento movimiento);
        bool Save();
    }
}
