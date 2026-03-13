using Microsoft.EntityFrameworkCore;
using ParkingManagementAPI.Data;
using ParkingManagementAPI.DTOs;
using ParkingManagementAPI.Services.Interfaces;

namespace ParkingManagementAPI.Services;

public class ParkingRecordsService : IParkingRecordsService
{
    private readonly AppDbContext _db;

    public ParkingRecordsService(AppDbContext db) => _db = db;

    public async Task<ApiResponse<List<SessionResponseDto>>> GetRecordsAsync(RecordsQueryDto query)
    {
        var q = _db.ParkingSessions
            .Where(s => s.Status == "completed")
            .AsQueryable();

        // Search by vehicle number
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.ToLower();
            q = q.Where(s => s.VehicleNumber.ToLower().Contains(search));
        }

        // Filter by date range
        if (!string.IsNullOrWhiteSpace(query.DateFrom) && DateTime.TryParse(query.DateFrom, out var from))
            q = q.Where(s => s.EntryTime >= from);

        if (!string.IsNullOrWhiteSpace(query.DateTo) && DateTime.TryParse(query.DateTo, out var to))
            q = q.Where(s => s.EntryTime <= to.AddDays(1));

        // Filter by slot
        if (!string.IsNullOrWhiteSpace(query.Slot))
            q = q.Where(s => s.AssignedSlot == query.Slot);

        // Sorting
        q = (query.SortBy?.ToLower(), query.SortOrder?.ToLower()) switch
        {
            ("entrytime", "asc") => q.OrderBy(s => s.EntryTime),
            ("entrytime", _) => q.OrderByDescending(s => s.EntryTime),
            ("exittime", "asc") => q.OrderBy(s => s.ExitTime),
            ("exittime", _) => q.OrderByDescending(s => s.ExitTime),
            ("duration", "asc") => q.OrderBy(s => s.Duration),
            ("duration", _) => q.OrderByDescending(s => s.Duration),
            ("fee", "asc") => q.OrderBy(s => s.Fee),
            ("fee", _) => q.OrderByDescending(s => s.Fee),
            _ => q.OrderByDescending(s => s.EntryTime),
        };

        // Pagination
        var totalItems = await q.CountAsync();
        var page = Math.Max(1, query.Page);
        var pageSize = Math.Clamp(query.PageSize, 1, 100);
        var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

        var records = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        var meta = new PaginationMeta
        {
            CurrentPage = page,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalPages,
        };

        var data = records.Select(s => new SessionResponseDto
        {
            Id = s.Id,
            VehicleNumber = s.VehicleNumber,
            VehicleType = s.VehicleType,
            AssignedSlot = s.AssignedSlot,
            EntryTime = s.EntryTime.ToString("o"),
            ExitTime = s.ExitTime?.ToString("o"),
            Duration = s.Duration,
            Fee = s.Fee,
            Status = s.Status,
        }).ToList();

        return ApiResponse<List<SessionResponseDto>>.Ok(data, "Records retrieved successfully", meta);
    }
}
