using Microsoft.EntityFrameworkCore;
using ParkingManagementAPI.Entities;

namespace ParkingManagementAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<ParkingSlot> ParkingSlots => Set<ParkingSlot>();
    public DbSet<ParkingSession> ParkingSessions => Set<ParkingSession>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ParkingSlot config
        modelBuilder.Entity<ParkingSlot>(e =>
        {
            e.HasKey(s => s.Id);
            e.HasIndex(s => s.SlotNumber).IsUnique();
            e.HasIndex(s => s.IsAvailable);
            e.HasIndex(s => s.SlotType);
        });

        // ParkingSession config
        modelBuilder.Entity<ParkingSession>(e =>
        {
            e.HasKey(s => s.Id);
            e.HasIndex(s => s.VehicleNumber);
            e.HasIndex(s => s.AssignedSlot);
            e.HasIndex(s => s.EntryTime);
            e.HasIndex(s => s.ExitTime);
            e.HasIndex(s => s.Status);
            e.HasIndex(s => new { s.EntryTime, s.Status });

            e.HasOne(s => s.Slot)
             .WithMany(sl => sl.Sessions)
             .HasForeignKey(s => s.AssignedSlot)
             .HasPrincipalKey(sl => sl.SlotNumber)
             .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
