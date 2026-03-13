using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ParkingManagementAPI.DTOs;

public class SlotResponseDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("slotNumber")]
    public string SlotNumber { get; set; } = string.Empty;

    [JsonPropertyName("slotType")]
    public string SlotType { get; set; } = string.Empty;

    [JsonPropertyName("isAvailable")]
    public bool IsAvailable { get; set; }

    [JsonPropertyName("createdAt")]
    public string CreatedAt { get; set; } = string.Empty;

    [JsonPropertyName("updatedAt")]
    public string UpdatedAt { get; set; } = string.Empty;
}

public class CreateSlotDto
{
    [Required]
    [MaxLength(10)]
    public string SlotNumber { get; set; } = string.Empty;

    [Required]
    [MaxLength(15)]
    public string SlotType { get; set; } = "standard";
}

public class UpdateSlotDto
{
    [MaxLength(10)]
    public string? SlotNumber { get; set; }

    [MaxLength(15)]
    public string? SlotType { get; set; }

    public bool? IsAvailable { get; set; }
}
