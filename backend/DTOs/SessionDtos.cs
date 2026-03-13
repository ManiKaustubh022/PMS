using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ParkingManagementAPI.DTOs;

public class SessionResponseDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("vehicleNumber")]
    public string VehicleNumber { get; set; } = string.Empty;

    [JsonPropertyName("vehicleType")]
    public string VehicleType { get; set; } = string.Empty;

    [JsonPropertyName("assignedSlot")]
    public string AssignedSlot { get; set; } = string.Empty;

    [JsonPropertyName("driverName")]
    public string? DriverName { get; set; }

    [JsonPropertyName("phoneNumber")]
    public string? PhoneNumber { get; set; }

    [JsonPropertyName("licenseNumber")]
    public string? LicenseNumber { get; set; }

    [JsonPropertyName("entryTime")]
    public string EntryTime { get; set; } = string.Empty;

    [JsonPropertyName("exitTime")]
    public string? ExitTime { get; set; }

    [JsonPropertyName("duration")]
    public int? Duration { get; set; }

    [JsonPropertyName("expectedDuration")]
    public int? ExpectedDuration { get; set; }

    [JsonPropertyName("fee")]
    public decimal? Fee { get; set; }

    [JsonPropertyName("fine")]
    public decimal? Fine { get; set; }

    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty;
}

public class CreateSessionDto
{
    [Required]
    [MaxLength(20)]
    public string VehicleNumber { get; set; } = string.Empty;

    [Required]
    [MaxLength(15)]
    public string VehicleType { get; set; } = "car";

    [Required]
    [MaxLength(10)]
    public string AssignedSlot { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? DriverName { get; set; }

    [MaxLength(20)]
    public string? PhoneNumber { get; set; }

    [MaxLength(50)]
    public string? LicenseNumber { get; set; }

    public int? ExpectedDuration { get; set; } // minutes
}

public class UpdateSessionDto
{
    [MaxLength(20)]
    public string? VehicleNumber { get; set; }

    [MaxLength(15)]
    public string? VehicleType { get; set; }

    [MaxLength(10)]
    public string? AssignedSlot { get; set; }
}
