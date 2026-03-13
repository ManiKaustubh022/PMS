using ParkingManagementAPI.DTOs;

namespace ParkingManagementAPI.Services.Interfaces;

public interface IParkingRecordsService
{
    Task<ApiResponse<List<SessionResponseDto>>> GetRecordsAsync(RecordsQueryDto query);
}
