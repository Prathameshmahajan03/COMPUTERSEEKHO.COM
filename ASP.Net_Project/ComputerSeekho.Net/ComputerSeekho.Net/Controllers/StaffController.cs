using Microsoft.AspNetCore.Mvc;
using ComputerSeekho.Net.Models;
using ComputerSeekho.Net.IServices;

namespace ComputerSeekho.Net.Controllers;

[Route("staff")]
[ApiController]
[Microsoft.AspNetCore.Authorization.AllowAnonymous]
public class StaffController : ControllerBase
{
    private readonly IStaffService _staffService;

    public StaffController(IStaffService staffService)
    {
        _staffService = staffService;
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddStaff([FromBody] Staff staff)
    {
        if (await _staffService.GetStaffByUsernameAsync(staff.StaffUsername) != null)
        {
            return BadRequest(new { message = "Username already exists" });
        }
        
        if (await _staffService.GetStaffByEmailAsync(staff.StaffEmail) != null)
        {
            return BadRequest(new { message = "Email already exists" });
        }

        return Ok(await _staffService.AddStaffAsync(staff));
    }

    [HttpGet("getAll")]
    public async Task<IActionResult> GetAllStaff()
    {
        return Ok(await _staffService.GetAllStaffAsync());
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteStaff(int id)
    {
        var result = await _staffService.DeleteStaffAsync(id);
        if (!result) return BadRequest("Cannot delete staff with active enquiries or other links");
        return Ok("Staff deleted");
    }
}
