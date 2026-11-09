using EPPP_INVENTARIO_API.Models;

namespace EPPP_INVENTARIO_API.Repository.IRepository
{
    public interface ICategoriaRepository
    {
        ICollection<Categoria> GetCategorias();

        Categoria? GetCategory(int id);
        bool CategoriaExists(int id);
        bool CategoriaExists(string nombre);
        bool CategoriaHasProductos(int id);
        bool CreateCategoria(Categoria categoria);
        bool UpdateCategoria(Categoria categoria);
        bool DeleteCategoria(Categoria categoria);
        bool Save();
    }
}
