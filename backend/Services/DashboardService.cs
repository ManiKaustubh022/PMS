using Microsoft.EntityFrameworkCore;
using ParkingManagementAPI.Data;
using ParkingManagementAPI.DTOs;
using ParkingManagementAPI.Services.Interfaces;

namespace ParkingManagementAPI.Services;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _db;

    public DashboardService(AppDbContext db) => _db = db;

    public async Task<ApiResponse<DashboardStatsDto>> GetStatsAsync()
    {
        var totalSlots = await _db.ParkingSlots.CountAsync();
        var availableSlots = await _db.ParkingSlots.CountAsync(s => s.IsAvailable);
        var occupiedSlots = totalSlots - availableSlots;

        var todayUtc = DateTime.UtcNow.Date;
        var tomorrowUtc = todayUtc.AddDays(1);

        var todaySessions = await _db.ParkingSessions
            .Where(s => s.EntryTime >= todayUtc && s.EntryTime < tomorrowUtc)
            .ToListAsync();

        var vehiclesParkedToday = todaySessions.Count;
        var totalRevenueToday = todaySessions
            .Where(s => s.Status == "completed")
            .Sum(s => s.Fee ?? 0);

        // Weekly revenue (last 7 days)
        var weeklyLabels = new List<string>();
        var weeklyRevenue = new List<decimal>();
        for (int i = 6; i >= 0; i--)
        {
            var day = todayUtc.AddDays(-i);
            var nextDay = day.AddDays(1);
            weeklyLabels.Add(day.ToString("ddd"));
            var dayRevenue = await _db.ParkingSessions
                .Where(s => s.Status == "completed" && s.ExitTime >= day && s.ExitTime < nextDay)
                .SumAsync(s => s.Fee ?? 0);
            weeklyRevenue.Add(dayRevenue);
        }

        // Recent activity (last 10 sessions by entry/exit)
        var recentActivity = await GetRecentActivityInternalAsync(10);

        var stats = new DashboardStatsDto
        {
            TotalSlots = totalSlots,
            AvailableSlots = availableSlots,
            OccupiedSlots = occupiedSlots,
            VehiclesParkedToday = vehiclesParkedToday,
            TotalRevenueToday = totalRevenueToday,
            WeeklyRevenue = weeklyRevenue,
            WeeklyLabels = weeklyLabels,
            SlotUtilization = new SlotUtilizationDto { Available = availableSlots, Occupied = occupiedSlots },
            RecentActivity = recentActivity,
        };

        return ApiResponse<DashboardStatsDto>.Ok(stats, "Dashboard stats retrieved");
    }

    public async Task<ApiResponse<List<RecentActivityDto>>> GetRecentActivityAsync()
    {
        var activity = await GetRecentActivityInternalAsync(20);
        return ApiResponse<List<RecentActivityDto>>.Ok(activity, "Recent activity retrieved");
    }

    private async Task<List<RecentActivityDto>> GetRecentActivityInternalAsync(int count)
    {
        var recentSessions = await _db.ParkingSessions
            .OrderByDescending(s => s.EntryTime)
            .Take(count)
            .ToListAsync();

        var activities = new List<RecentActivityDto>();

        foreach (var s in recentSessions)
        {
            // Entry event
            activities.Add(new RecentActivityDto
            {
                Id = s.Id + "_entry",
                VehicleNumber = s.VehicleNumber,
                Action = "entry",
                SlotNumber = s.AssignedSlot,
                Timestamp = s.EntryTime.ToString("o"),
                Fee = null,
            });

            // Exit event (if completed)
            if (s.Status == "completed" && s.ExitTime.HasValue)
            {
                activities.Add(new RecentActivityDto
                {
                    Id = s.Id + "_exit",
                    VehicleNumber = s.VehicleNumber,
                    Action = "exit",
                    SlotNumber = s.AssignedSlot,
                    Timestamp = s.ExitTime.Value.ToString("o"),
                    Fee = s.Fee,
                });
            }
        }

        return activities.OrderByDescending(a => a.Timestamp).Take(count).ToList();
    }
}
