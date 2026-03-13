using ParkingManagementAPI.DTOs;

namespace ParkingManagementAPI.Services.Interfaces;

public interface IDashboardService
{
    Task<ApiResponse<DashboardStatsDto>> GetStatsAsync();
    Task<ApiResponse<List<RecentActivityDto>>> GetRecentActivityAsync();
}
