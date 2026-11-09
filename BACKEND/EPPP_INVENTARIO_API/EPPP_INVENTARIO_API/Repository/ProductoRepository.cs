using EPPP_INVENTARIO_API.Data;
using EPPP_INVENTARIO_API.Models;
using EPPP_INVENTARIO_API.Repository.IRepository;
using Microsoft.EntityFrameworkCore;

namespace EPPP_INVENTARIO_API.Repository
{
    public class ProductoRepository : IProductoRepository
    {
        private readonly ApplicationDbContext _db;
        public ProductoRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public bool CreateProducto(Producto producto)
        {
            producto.FechaCreacion = DateTime.Now;
            _db.Producto.Add(producto);
            return Save();
        }

        public bool DeleteProducto(Producto producto)
        {
            _db.Producto.Remove(producto);
            return Save();
        }

        public Producto? GetProducto(int id)
        {
            return _db.Producto.Include(p => p.Categoria).FirstOrDefault(p => p.ProductoId == id);
        }

        public ICollection<Producto> GetProductos()
        {
            return _db.Producto.Include(p => p.Categoria).OrderBy(p => p.Nombre).ToList();
        }

        public ICollection<Producto> GetProductoBySearch(string search)
        {
            IQueryable<Producto> query = _db.Producto.Include(p => p.Categoria);
            if (!string.IsNullOrWhiteSpace(search))
            {
                var termino = search.ToLower().Trim();
                query = query.Where(p => p.Nombre.ToLower().Contains(termino)
                    || p.Codigo.ToLower().Contains(termino)
                    || (p.Descripcion != null && p.Descripcion.ToLower().Contains(termino))
                    || (p.Marca != null && p.Marca.ToLower().Contains(termino)));
            }

            return query.OrderBy(p => p.Nombre).ToList();
        }

        public bool ProductoExists(int id)
        {
            return _db.Producto.Any(p => p.ProductoId == id);
        }

        public bool ProductoExists(string codigo)
        {
            return _db.Producto.Any(p => p.Codigo.ToLower().Trim() == codigo.ToLower().Trim());
        }

        public bool ProductoExists(string codigo, int idExcluir)
        {
            return _db.Producto.Any(p => p.ProductoId != idExcluir && p.Codigo.ToLower().Trim() == codigo.ToLower().Trim());
        }

        public bool Save()
        {
           return _db.SaveChanges() >= 0 ? true : false;
        }

        public bool UpdateProducto(Producto producto)
        {
            _db.Producto.Update(producto);
            return Save();
        }
    }
}
