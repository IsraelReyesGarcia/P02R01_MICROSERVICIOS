using EPP_MOVIMIENTO_API.Models;

namespace EPP_MOVIMIENTO_API.Repository.IRepository
{
    public interface IEmpleadoRepository
    {
        ICollection<Empleado> GetEmpleados();
        Empleado? GetEmpleado(int id);
        bool EmpleadoExists(int id);
        bool EmpleadoExists(string numEmpleado);
        bool EmpleadoExists(string numEmpleado, int idExcluir);
        bool EmpleadoHasMovimientos(int id);
        bool CreateEmpleado(Empleado empleado);
        bool UpdateEmpleado(Empleado empleado);
        bool DeleteEmpleado(Empleado empleado);
        bool Save();
    }
}
