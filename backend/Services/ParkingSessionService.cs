using Microsoft.EntityFrameworkCore;
using ParkingManagementAPI.Data;
using ParkingManagementAPI.DTOs;
using ParkingManagementAPI.Entities;
using ParkingManagementAPI.Services.Interfaces;

namespace ParkingManagementAPI.Services;

public class ParkingSessionService : IParkingSessionService
{
    private readonly AppDbContext _db;

    private static readonly Dictionary<string, decimal> FeeRates = new()
    {
        { "car", 0.50m },
        { "motorcycle", 0.33m },
        { "suv", 0.65m },
        { "truck", 0.70m },
    };

    public ParkingSessionService(AppDbContext db) => _db = db;

    public async Task<ApiResponse<List<SessionResponseDto>>> GetAllAsync()
    {
        var sessions = await _db.ParkingSessions
            .OrderByDescending(s => s.EntryTime)
            .ToListAsync();
        return ApiResponse<List<SessionResponseDto>>.Ok(
            sessions.Select(MapToDto).ToList(),
            "Sessions retrieved successfully"
        );
    }

    public async Task<ApiResponse<SessionResponseDto?>> GetByIdAsync(string id)
    {
        var session = await _db.ParkingSessions.FindAsync(id);
        if (session == null)
            return ApiResponse<SessionResponseDto?>.Fail(null, "Session not found");
        return ApiResponse<SessionResponseDto?>.Ok(MapToDto(session), "Session found");
    }

    public async Task<ApiResponse<SessionResponseDto>> CreateAsync(CreateSessionDto dto)
    {
        var count = await _db.ParkingSessions.CountAsync();
        var session = new ParkingSession
        {
            Id = "PS" + (count + 1).ToString("D3"),
            VehicleNumber = dto.VehicleNumber.ToUpper(),
            VehicleType = dto.VehicleType,
            AssignedSlot = dto.AssignedSlot,
            DriverName = dto.DriverName,
            PhoneNumber = dto.PhoneNumber,
            LicenseNumber = dto.LicenseNumber,
            EntryTime = DateTime.UtcNow,
            ExitTime = null,
            Duration = null,
            ExpectedDuration = dto.ExpectedDuration,
            Fee = null,
            Fine = null,
            Status = "active",
        };

        _db.ParkingSessions.Add(session);

        // Mark slot as occupied
        var slot = await _db.ParkingSlots.FirstOrDefaultAsync(s => s.SlotNumber == dto.AssignedSlot);
        if (slot != null)
        {
            slot.IsAvailable = false;
            slot.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();
        return ApiResponse<SessionResponseDto>.Ok(MapToDto(session), "Vehicle entry registered successfully");
    }

    public async Task<ApiResponse<SessionResponseDto?>> UpdateAsync(string id, UpdateSessionDto dto)
    {
        var session = await _db.ParkingSessions.FindAsync(id);
        if (session == null)
            return ApiResponse<SessionResponseDto?>.Fail(null, "Session not found");

        if (dto.VehicleNumber != null) session.VehicleNumber = dto.VehicleNumber.ToUpper();
        if (dto.VehicleType != null) session.VehicleType = dto.VehicleType;
        if (dto.AssignedSlot != null) session.AssignedSlot = dto.AssignedSlot;

        await _db.SaveChangesAsync();
        return ApiResponse<SessionResponseDto?>.Ok(MapToDto(session), "Session updated successfully");
    }

    public async Task<ApiResponse<SessionResponseDto?>> CompleteExitAsync(string id)
    {
        var session = await _db.ParkingSessions.FindAsync(id);
        if (session == null)
            return ApiResponse<SessionResponseDto?>.Fail(null, "Session not found");

        if (session.Status == "completed")
            return ApiResponse<SessionResponseDto?>.Fail(MapToDto(session), "Session already completed");

        var exitTime = DateTime.UtcNow;
        var durationMinutes = Math.Max(1, (int)Math.Round((exitTime - session.EntryTime).TotalMinutes));
        var rate = FeeRates.GetValueOrDefault(session.VehicleType, 0.50m);
        var baseFee = Math.Round(durationMinutes * rate, 2);
        
        decimal fine = 0;
        if (session.ExpectedDuration.HasValue && durationMinutes > session.ExpectedDuration.Value)
        {
            var extraMinutes = durationMinutes - session.ExpectedDuration.Value;
            var penaltyRate = rate * 2; // Fine is double the normal rate for extra time
            fine = Math.Round(extraMinutes * penaltyRate, 2);
        }

        session.ExitTime = exitTime;
        session.Duration = durationMinutes;
        session.Fee = baseFee;
        session.Fine = fine;
        session.Status = "completed";

        // Free the slot
        var slot = await _db.ParkingSlots.FirstOrDefaultAsync(s => s.SlotNumber == session.AssignedSlot);
        if (slot != null)
        {
            slot.IsAvailable = true;
            slot.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();
        var totalAmount = baseFee + fine;
        return ApiResponse<SessionResponseDto?>.Ok(
            MapToDto(session),
            $"Vehicle exit completed. Total Amount: ₹{totalAmount}"
        );
    }

    private static SessionResponseDto MapToDto(ParkingSession s) => new()
    {
        Id = s.Id,
        VehicleNumber = s.VehicleNumber,
        VehicleType = s.VehicleType,
        AssignedSlot = s.AssignedSlot,
        DriverName = s.DriverName,
        PhoneNumber = s.PhoneNumber,
        LicenseNumber = s.LicenseNumber,
        EntryTime = s.EntryTime.ToString("o"),
        ExitTime = s.ExitTime?.ToString("o"),
        Duration = s.Duration,
        ExpectedDuration = s.ExpectedDuration,
        Fee = s.Fee,
        Fine = s.Fine,
        Status = s.Status,
    };
}
