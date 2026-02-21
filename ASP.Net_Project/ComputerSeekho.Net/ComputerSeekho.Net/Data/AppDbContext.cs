using Microsoft.EntityFrameworkCore;
using ComputerSeekho.Net.Models;

namespace ComputerSeekho.Net.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Staff> Staff { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<Batch> Batches { get; set; }
    public DbSet<Student> Students { get; set; }
    public DbSet<Enquiry> Enquiries { get; set; }
    public DbSet<PaymentType> PaymentTypes { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<Receipt> Receipts { get; set; }
    public DbSet<Recruiter> Recruiters { get; set; }
    public DbSet<Placement> Placements { get; set; }
    public DbSet<News> News { get; set; }
    public DbSet<Album> Albums { get; set; }
    public DbSet<Video> Videos { get; set; }
    public DbSet<GetInTouch> GetInTouch { get; set; }
    public DbSet<ClosureReason> ClosureReasons { get; set; }

    // Add other DbSets as we create more models (Payment, Recruiter, etc.)

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Any custom mapping if needed, though attributes handled most of it.
        // Example: defining composite keys or specific relationships if convention fails.
    }
}
