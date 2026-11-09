using EPP_MOVIMIENTO_API.Data;
using EPP_MOVIMIENTO_API.Models;
using EPP_MOVIMIENTO_API.Repository.IRepository;
using Microsoft.EntityFrameworkCore;

namespace EPP_MOVIMIENTO_API.Repository
{
    public class MovimientoRepository : IMovimientoRepository
    {
        private readonly ApplicationDbContext _db;

        public MovimientoRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public bool CreateMovimiento(Movimiento movimiento)
        {
            movimiento.FechaMovimiento = DateTime.Now;
            _db.Movimiento.Add(movimiento);
            return Save();
        }

        public bool DeleteMovimiento(Movimiento movimiento)
        {
            _db.Movimiento.Remove(movimiento);
            return Save();
        }

        public Movimiento? GetMovimiento(int id)
        {
            return _db.Movimiento.Include(m => m.Empleado).FirstOrDefault(m => m.MovimientoId == id);
        }

        public ICollection<Movimiento> GetMovimientos()
        {
            return _db.Movimiento.Include(m => m.Empleado).OrderByDescending(m => m.FechaMovimiento).ToList();
        }

        public ICollection<Movimiento> GetMovimientosByEmpleado(int empleadoId)
        {
            return _db.Movimiento.Include(m => m.Empleado)
                .Where(m => m.EmpleadoId == empleadoId)
                .OrderByDescending(m => m.FechaMovimiento)
                .ToList();
        }

        public ICollection<Movimiento> GetMovimientosByProducto(int productoId)
        {
            return _db.Movimiento.Include(m => m.Empleado)
                .Where(m => m.ProductoId == productoId)
                .OrderByDescending(m => m.FechaMovimiento)
                .ToList();
        }

        public bool MovimientoExists(int id)
        {
            return _db.Movimiento.Any(m => m.MovimientoId == id);
        }

        public bool Save()
        {
            return _db.SaveChanges() >= 0 ? true : false;
        }
    }
}
