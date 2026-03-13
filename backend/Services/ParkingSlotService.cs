using Microsoft.EntityFrameworkCore;
using ParkingManagementAPI.Data;
using ParkingManagementAPI.DTOs;
using ParkingManagementAPI.Entities;
using ParkingManagementAPI.Services.Interfaces;

namespace ParkingManagementAPI.Services;

public class ParkingSlotService : IParkingSlotService
{
    private readonly AppDbContext _db;

    public ParkingSlotService(AppDbContext db) => _db = db;

    public async Task<ApiResponse<List<SlotResponseDto>>> GetAllAsync()
    {
        var slots = await _db.ParkingSlots.OrderBy(s => s.SlotNumber).ToListAsync();
        return ApiResponse<List<SlotResponseDto>>.Ok(
            slots.Select(MapToDto).ToList(),
            "Parking slots retrieved successfully"
        );
    }

    public async Task<ApiResponse<SlotResponseDto?>> GetByIdAsync(string id)
    {
        var slot = await _db.ParkingSlots.FindAsync(id);
        if (slot == null)
            return ApiResponse<SlotResponseDto?>.Fail(null, "Slot not found");
        return ApiResponse<SlotResponseDto?>.Ok(MapToDto(slot), "Slot found");
    }

    public async Task<ApiResponse<SlotResponseDto>> CreateAsync(CreateSlotDto dto)
    {
        var count = await _db.ParkingSlots.CountAsync();
        var slot = new ParkingSlot
        {
            Id = "S" + (count + 1).ToString("D3"),
            SlotNumber = dto.SlotNumber,
            SlotType = dto.SlotType,
            IsAvailable = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        _db.ParkingSlots.Add(slot);
        await _db.SaveChangesAsync();
        return ApiResponse<SlotResponseDto>.Ok(MapToDto(slot), "Parking slot created successfully");
    }

    public async Task<ApiResponse<SlotResponseDto?>> UpdateAsync(string id, UpdateSlotDto dto)
    {
        var slot = await _db.ParkingSlots.FindAsync(id);
        if (slot == null)
            return ApiResponse<SlotResponseDto?>.Fail(null, "Slot not found");

        if (dto.SlotNumber != null) slot.SlotNumber = dto.SlotNumber;
        if (dto.SlotType != null) slot.SlotType = dto.SlotType;
        if (dto.IsAvailable.HasValue) slot.IsAvailable = dto.IsAvailable.Value;
        slot.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return ApiResponse<SlotResponseDto?>.Ok(MapToDto(slot), "Parking slot updated successfully");
    }

    public async Task<ApiResponse<object?>> DeleteAsync(string id)
    {
        var slot = await _db.ParkingSlots.FindAsync(id);
        if (slot == null)
            return ApiResponse<object?>.Fail(null, "Slot not found");

        _db.ParkingSlots.Remove(slot);
        await _db.SaveChangesAsync();
        return ApiResponse<object?>.Ok(null, "Parking slot deleted successfully");
    }

    private static SlotResponseDto MapToDto(ParkingSlot s) => new()
    {
        Id = s.Id,
        SlotNumber = s.SlotNumber,
        SlotType = s.SlotType,
        IsAvailable = s.IsAvailable,
        CreatedAt = s.CreatedAt.ToString("o"),
        UpdatedAt = s.UpdatedAt.ToString("o"),
    };
}
