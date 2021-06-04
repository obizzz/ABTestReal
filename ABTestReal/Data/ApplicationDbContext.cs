using ABTestReal.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ABTestReal.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Record> Records { get; set; }
        
        
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        public ApplicationDbContext()
        {
            
        }
    }
}