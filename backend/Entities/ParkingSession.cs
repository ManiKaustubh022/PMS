using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParkingManagementAPI.Entities;

[Table("ParkingSessions")]
public class ParkingSession
{
    [Key]
    [MaxLength(10)]
    public string Id { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string VehicleNumber { get; set; } = string.Empty;

    [Required]
    [MaxLength(15)]
    public string VehicleType { get; set; } = "car"; // car | motorcycle | truck | suv

    [Required]
    [MaxLength(10)]
    public string AssignedSlot { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? DriverName { get; set; }

    [MaxLength(20)]
    public string? PhoneNumber { get; set; }

    [MaxLength(50)]
    public string? LicenseNumber { get; set; }

    public DateTime EntryTime { get; set; } = DateTime.UtcNow;

    public DateTime? ExitTime { get; set; }

    public int? Duration { get; set; } // minutes

    public int? ExpectedDuration { get; set; } // minutes

    [Column(TypeName = "decimal(10,2)")]
    public decimal? Fee { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal? Fine { get; set; }

    [Required]
    [MaxLength(15)]
    public string Status { get; set; } = "active"; // active | completed

    // Navigation
    [ForeignKey("AssignedSlot")]
    public ParkingSlot? Slot { get; set; }
}
