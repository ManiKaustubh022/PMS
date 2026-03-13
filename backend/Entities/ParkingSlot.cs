using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParkingManagementAPI.Entities;

[Table("ParkingSlots")]
public class ParkingSlot
{
    [Key]
    [MaxLength(10)]
    public string Id { get; set; } = string.Empty;

    [Required]
    [MaxLength(10)]
    public string SlotNumber { get; set; } = string.Empty;

    [Required]
    [MaxLength(15)]
    public string SlotType { get; set; } = "standard"; // compact | standard | large | handicapped

    public bool IsAvailable { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<ParkingSession> Sessions { get; set; } = new List<ParkingSession>();
}
