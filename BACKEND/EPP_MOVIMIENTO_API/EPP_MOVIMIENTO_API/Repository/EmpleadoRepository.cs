using EPP_MOVIMIENTO_API.Data;
using EPP_MOVIMIENTO_API.Models;
using EPP_MOVIMIENTO_API.Repository.IRepository;

namespace EPP_MOVIMIENTO_API.Repository
{
    public class EmpleadoRepository : IEmpleadoRepository
    {
        private readonly ApplicationDbContext _db;

        public EmpleadoRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public bool CreateEmpleado(Empleado empleado)
        {
            empleado.FechaAlta = DateTime.Now;
            _db.Empleado.Add(empleado);
            return Save();
        }

        public bool DeleteEmpleado(Empleado empleado)
        {
            _db.Empleado.Remove(empleado);
            return Save();
        }

        public bool EmpleadoExists(int id)
        {
            return _db.Empleado.Any(e => e.EmpleadoId == id);
        }

        public bool EmpleadoExists(string numEmpleado)
        {
            return _db.Empleado.Any(e => e.NumEmpleado.ToLower().Trim() == numEmpleado.ToLower().Trim());
        }

        public bool EmpleadoExists(string numEmpleado, int idExcluir)
        {
            return _db.Empleado.Any(e => e.EmpleadoId != idExcluir && e.NumEmpleado.ToLower().Trim() == numEmpleado.ToLower().Trim());
        }

        public bool EmpleadoHasMovimientos(int id)
        {
            return _db.Movimiento.Any(m => m.EmpleadoId == id);
        }

        public Empleado? GetEmpleado(int id)
        {
            return _db.Empleado.FirstOrDefault(e => e.EmpleadoId == id);
        }

        public ICollection<Empleado> GetEmpleados()
        {
            return _db.Empleado.OrderBy(e => e.NumEmpleado).ToList();
        }

        public bool Save()
        {
            return _db.SaveChanges() >= 0 ? true : false;
        }

        public bool UpdateEmpleado(Empleado empleado)
        {
            _db.Empleado.Update(empleado);
            return Save();
        }
    }
}
