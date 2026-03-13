using System.Text.Json.Serialization;

namespace ParkingManagementAPI.DTOs;

public class DashboardStatsDto
{
    [JsonPropertyName("totalSlots")]
    public int TotalSlots { get; set; }

    [JsonPropertyName("availableSlots")]
    public int AvailableSlots { get; set; }

    [JsonPropertyName("occupiedSlots")]
    public int OccupiedSlots { get; set; }

    [JsonPropertyName("vehiclesParkedToday")]
    public int VehiclesParkedToday { get; set; }

    [JsonPropertyName("totalRevenueToday")]
    public decimal TotalRevenueToday { get; set; }

    [JsonPropertyName("weeklyRevenue")]
    public List<decimal> WeeklyRevenue { get; set; } = new();

    [JsonPropertyName("weeklyLabels")]
    public List<string> WeeklyLabels { get; set; } = new();

    [JsonPropertyName("slotUtilization")]
    public SlotUtilizationDto SlotUtilization { get; set; } = new();

    [JsonPropertyName("recentActivity")]
    public List<RecentActivityDto> RecentActivity { get; set; } = new();
}

public class SlotUtilizationDto
{
    [JsonPropertyName("available")]
    public int Available { get; set; }

    [JsonPropertyName("occupied")]
    public int Occupied { get; set; }
}

public class RecentActivityDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("vehicleNumber")]
    public string VehicleNumber { get; set; } = string.Empty;

    [JsonPropertyName("action")]
    public string Action { get; set; } = string.Empty; // "entry" | "exit"

    [JsonPropertyName("slotNumber")]
    public string SlotNumber { get; set; } = string.Empty;

    [JsonPropertyName("timestamp")]
    public string Timestamp { get; set; } = string.Empty;

    [JsonPropertyName("fee")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public decimal? Fee { get; set; }
}

public class RecordsQueryDto
{
    public string? Search { get; set; }
    public string? DateFrom { get; set; }
    public string? DateTo { get; set; }
    public string? Slot { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string SortBy { get; set; } = "entryTime";
    public string SortOrder { get; set; } = "desc";
}
