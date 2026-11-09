using EPPP_INVENTARIO_API.Models;
using Microsoft.EntityFrameworkCore;

namespace EPPP_INVENTARIO_API.Data
{
    public class ApplicationDbContext:DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options): base(options)
        { }

        public DbSet<Categoria> Categoria { get; set; }
        public DbSet<Producto> Producto { get; set; }
    }
}