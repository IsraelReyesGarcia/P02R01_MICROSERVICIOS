using EPPP_INVENTARIO_API.Models;

namespace EPPP_INVENTARIO_API.Repository.IRepository
{
    public interface IProductoRepository
    {
        //Obtener productos
        ICollection<Producto> GetProductos();
        ICollection<Producto> GetProductoBySearch(string search);
        Producto? GetProducto(int id);
        bool ProductoExists(int id);
        bool ProductoExists(string codigo);
        bool ProductoExists(string codigo, int idExcluir);
        bool CreateProducto(Producto producto);
        bool UpdateProducto(Producto producto);
        bool DeleteProducto(Producto producto);
        bool Save();
    }
}
