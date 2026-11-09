using EPP_MOVIMIENTO_API.Models;
using Microsoft.EntityFrameworkCore;

namespace EPP_MOVIMIENTO_API.Data
{
    public class ApplicationDbContext:DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options): base(options)
        { }

        public DbSet<Empleado> Empleado { get; set; }
        public DbSet<Movimiento> Movimiento { get; set; }
    }
}
