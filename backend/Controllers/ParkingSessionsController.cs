using Microsoft.AspNetCore.Mvc;
using ParkingManagementAPI.DTOs;
using ParkingManagementAPI.Services.Interfaces;

namespace ParkingManagementAPI.Controllers;

[ApiController]
[Route("api/parking-sessions")]
public class ParkingSessionsController : ControllerBase
{
    private readonly IParkingSessionService _service;

    public ParkingSessionsController(IParkingSessionService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var result = await _service.GetByIdAsync(id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSessionDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Data.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateSessionDto dto)
    {
        var result = await _service.UpdateAsync(id, dto);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpPut("{id}/complete")]
    public async Task<IActionResult> Complete(string id)
    {
        var result = await _service.CompleteExitAsync(id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }
}
