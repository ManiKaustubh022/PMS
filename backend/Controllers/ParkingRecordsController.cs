using Microsoft.AspNetCore.Mvc;
using ParkingManagementAPI.DTOs;
using ParkingManagementAPI.Services.Interfaces;

namespace ParkingManagementAPI.Controllers;

[ApiController]
[Route("api/parking-records")]
public class ParkingRecordsController : ControllerBase
{
    private readonly IParkingRecordsService _service;

    public ParkingRecordsController(IParkingRecordsService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] RecordsQueryDto query)
    {
        var result = await _service.GetRecordsAsync(query);
        return Ok(result);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] RecordsQueryDto query)
    {
        var result = await _service.GetRecordsAsync(query);
        return Ok(result);
    }
}
