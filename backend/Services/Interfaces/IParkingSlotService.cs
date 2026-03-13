using ParkingManagementAPI.DTOs;

namespace ParkingManagementAPI.Services.Interfaces;

public interface IParkingSlotService
{
    Task<ApiResponse<List<SlotResponseDto>>> GetAllAsync();
    Task<ApiResponse<SlotResponseDto?>> GetByIdAsync(string id);
    Task<ApiResponse<SlotResponseDto>> CreateAsync(CreateSlotDto dto);
    Task<ApiResponse<SlotResponseDto?>> UpdateAsync(string id, UpdateSlotDto dto);
    Task<ApiResponse<object?>> DeleteAsync(string id);
}
