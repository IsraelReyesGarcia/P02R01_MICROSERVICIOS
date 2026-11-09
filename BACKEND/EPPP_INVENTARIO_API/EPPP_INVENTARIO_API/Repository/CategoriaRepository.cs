using EPPP_INVENTARIO_API.Data;
using EPPP_INVENTARIO_API.Models;
using EPPP_INVENTARIO_API.Repository.IRepository;

namespace EPPP_INVENTARIO_API.Repository
{
    public class CategoriaRepository : ICategoriaRepository
    {
        private readonly ApplicationDbContext _db;

        public CategoriaRepository(ApplicationDbContext db)
        {
            _db = db;
        }
        public bool CategoriaExists(int id)
        {
            return _db.Categoria.Any(c => c.CategoriaId == id);
        }

        public bool CategoriaExists(string nombre)
        {
            return _db.Categoria.Any(c => c.Nombre.ToLower().Trim() == nombre.ToLower().Trim());
        }

        public bool CategoriaHasProductos(int id)
        {
            return _db.Producto.Any(p => p.CategoriaId == id);
        }

        public bool CreateCategoria(Categoria categoria)
        {
            categoria.FechaCreacion = DateTime.Now;
            _db.Categoria.Add(categoria);
            return Save();
        }

        public bool DeleteCategoria(Categoria categoria)
        {
            _db.Categoria.Remove(categoria);
            return Save();
        }

        public ICollection<Categoria> GetCategorias()
        {
            return _db.Categoria.OrderBy(c => c.Nombre).ToList();
        }

        public Categoria? GetCategory(int id)
        {
            return _db.Categoria.FirstOrDefault(c => c.CategoriaId == id);

        }

        public bool Save()
        {
            return _db.SaveChanges() >= 0 ? true : false;
        }

        public bool UpdateCategoria(Categoria categoria)
        {
            categoria.FechaCreacion = DateTime.Now;
            _db.Categoria.Update(categoria);
            return Save();

        }
    }
}
