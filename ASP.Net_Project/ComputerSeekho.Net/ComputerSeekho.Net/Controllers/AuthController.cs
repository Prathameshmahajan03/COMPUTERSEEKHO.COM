using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using ComputerSeekho.Net.Data;
using ComputerSeekho.Net.DTOs;
using ComputerSeekho.Net.Models;
using ComputerSeekho.Net.Utility;

namespace ComputerSeekho.Net.Controllers;

[Route("auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;

    public AuthController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
        _httpClient = new HttpClient();
    }

    [HttpPost("signIn")]
    public async Task<IActionResult> SignIn([FromBody] LoginRequestDto loginRequest)
    {
        var staff = await _context.Staff.FirstOrDefaultAsync(s => s.StaffUsername == loginRequest.Username);

        if (staff == null)
            return Unauthorized(new { message = "Invalid Username" });

        if (!PasswordHelper.VerifyPassword(loginRequest.Password, staff.StaffPassword))
            return Unauthorized(new { message = "Invalid Password" });

        var token = GenerateJwtToken(staff);
        
        // Return structured response matching Java
        // Java Logic: ResponseEntity.ok().header(SecurityConstant.JWT_HEADER, SecurityConstant.JWT_PREFIX + jwt).body(map);
        
        var response = new AuthResponseDto
        {
            Message = "Login Successful",
            Username = staff.StaffUsername
        };
        
        // Add Authorization Header
        Response.Headers.Append("Authorization", "Bearer " + token);

        return Ok(response);
    }

    [HttpPost("google-login")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto googleDto)
    {
        try
        {
            // Verify with Google
            // Java did: "https://oauth2.googleapis.com/tokeninfo?id_token=" + token
            var url = $"https://oauth2.googleapis.com/tokeninfo?id_token={googleDto.Token}";
            var googleResponse = await _httpClient.GetAsync(url);

            if (!googleResponse.IsSuccessStatusCode)
                return Unauthorized("Invalid Google Token");

            var jsonContent = await googleResponse.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(jsonContent);
            
            if (!doc.RootElement.TryGetProperty("email", out var emailProp))
                return Unauthorized("Email not found in Google Token");

            string email = emailProp.GetString() ?? "";

            // Check Staff
            var staff = await _context.Staff.FirstOrDefaultAsync(s => s.StaffEmail == email);
            if (staff == null)
                return Unauthorized($"Email not registered as Staff: {email}");

            // Generate Token
            var token = GenerateJwtToken(staff);

            Response.Headers.Append("Authorization", "Bearer " + token);

            return Ok(new Dictionary<string, string>
            {
                { "message", "Google Login Successful" },
                { "username", staff.StaffUsername }
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Error processing Google Login: " + ex.Message);
        }
    }

    private string GenerateJwtToken(Staff staff)
    {
        var keyStr = _configuration["Jwt:Key"];
        var issuer = _configuration["Jwt:Issuer"];
        var audience = _configuration["Jwt:Audience"];
        
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyStr!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, staff.StaffUsername),
            new Claim(ClaimTypes.Name, staff.StaffUsername),
            new Claim("role", staff.StaffRole ?? "ROLE_STAFF") // Default role if null
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.Now.AddHours(10), // Java code usually sets this
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
