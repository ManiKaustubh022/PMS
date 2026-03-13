using Microsoft.AspNetCore.Mvc;
using ParkingManagementAPI.Services.Interfaces;

namespace ParkingManagementAPI.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _service;

    public DashboardController(IDashboardService service) => _service = service;

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var result = await _service.GetStatsAsync();
        return Ok(result);
    }

    [HttpGet("recent-activity")]
    public async Task<IActionResult> GetRecentActivity()
    {
        var result = await _service.GetRecentActivityAsync();
        return Ok(result);
    }
}
