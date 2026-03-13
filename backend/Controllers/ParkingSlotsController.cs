using Microsoft.AspNetCore.Mvc;
using ParkingManagementAPI.DTOs;
using ParkingManagementAPI.Services.Interfaces;

namespace ParkingManagementAPI.Controllers;

[ApiController]
[Route("api/parking-slots")]
public class ParkingSlotsController : ControllerBase
{
    private readonly IParkingSlotService _service;

    public ParkingSlotsController(IParkingSlotService service) => _service = service;

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
    public async Task<IActionResult> Create([FromBody] CreateSlotDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Data.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateSlotDto dto)
    {
        var result = await _service.UpdateAsync(id, dto);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _service.DeleteAsync(id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }
}
