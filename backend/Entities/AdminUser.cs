using System.ComponentModel.DataAnnotations;

namespace ParkingManagementAPI.Entities;

public class AdminUser
{
    [Key]
    public string Id { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string PasswordHash { get; set; } = string.Empty;

    [MaxLength(100)]
    public string DisplayName { get; set; } = "Administrator";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
