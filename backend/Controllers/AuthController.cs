using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ParkingManagementAPI.Data;
using ParkingManagementAPI.DTOs;
using System.Security.Cryptography;
using System.Text;

namespace ParkingManagementAPI.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;

    public AuthController(AppDbContext db) => _db = db;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
    {
        var admin = await _db.AdminUsers.FirstOrDefaultAsync(a => a.Username == dto.Username);
        if (admin == null)
            return Unauthorized(ApiResponse<object>.Fail(null!, "Invalid username or password"));

        var hash = HashPassword(dto.Password);
        if (admin.PasswordHash != hash)
            return Unauthorized(ApiResponse<object>.Fail(null!, "Invalid username or password"));

        // Simple token: base64 of username + timestamp (not JWT, kept simple for this project)
        var tokenPayload = $"{admin.Username}:{DateTime.UtcNow.Ticks}";
        var token = Convert.ToBase64String(Encoding.UTF8.GetBytes(tokenPayload));

        var response = new LoginResponseDto
        {
            Token = token,
            Username = admin.Username,
            DisplayName = admin.DisplayName,
        };

        return Ok(ApiResponse<LoginResponseDto>.Ok(response, "Login successful"));
    }

    [HttpPost("verify")]
    public IActionResult Verify()
    {
        var authHeader = Request.Headers["Authorization"].FirstOrDefault();
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            return Unauthorized(ApiResponse<object>.Fail(null!, "No valid token"));

        try
        {
            var token = authHeader["Bearer ".Length..];
            var decoded = Encoding.UTF8.GetString(Convert.FromBase64String(token));
            var parts = decoded.Split(':');
            if (parts.Length == 2)
                return Ok(ApiResponse<object>.Ok(new { username = parts[0] }, "Token valid"));
        }
        catch { }

        return Unauthorized(ApiResponse<object>.Fail(null!, "Invalid token"));
    }

    public static string HashPassword(string password)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
        return Convert.ToHexString(bytes).ToLower();
    }
}
