using ParkingManagementAPI.DTOs;

namespace ParkingManagementAPI.Services.Interfaces;

public interface IParkingSessionService
{
    Task<ApiResponse<List<SessionResponseDto>>> GetAllAsync();
    Task<ApiResponse<SessionResponseDto?>> GetByIdAsync(string id);
    Task<ApiResponse<SessionResponseDto>> CreateAsync(CreateSessionDto dto);
    Task<ApiResponse<SessionResponseDto?>> UpdateAsync(string id, UpdateSessionDto dto);
    Task<ApiResponse<SessionResponseDto?>> CompleteExitAsync(string id);
}
