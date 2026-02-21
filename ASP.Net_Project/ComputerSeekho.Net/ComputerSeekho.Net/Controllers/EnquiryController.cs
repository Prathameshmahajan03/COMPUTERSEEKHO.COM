using Microsoft.AspNetCore.Mvc;
using ComputerSeekho.Net.Models;
using ComputerSeekho.Net.IServices;

namespace ComputerSeekho.Net.Controllers;

[Route("enquiries")]
[ApiController]
[Microsoft.AspNetCore.Authorization.AllowAnonymous]
public class EnquiryController : ControllerBase
{
    private readonly IEnquiryService _enquiryService;

    public EnquiryController(IEnquiryService enquiryService)
    {
        _enquiryService = enquiryService;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateEnquiry([FromBody] Enquiry enquiry)
    {
        string? staffUsername = User.Identity?.Name;
        return Ok(await _enquiryService.SaveEnquiryAsync(enquiry, staffUsername));
    }

    [HttpGet("getAll")]
    public async Task<IActionResult> GetAllEnquiries()
    {
        return Ok(await _enquiryService.GetAllEnquiriesAsync());
    }

    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateEnquiry(int id, [FromBody] Enquiry enquiry)
    {
        var updated = await _enquiryService.UpdateEnquiryAsync(id, enquiry);
        if (updated == null) return NotFound();
        return Ok(updated);
    }

    [HttpGet("getbystaff/{username}")]
    public async Task<IActionResult> GetByStaff(string username)
    {
        return Ok(await _enquiryService.GetEnquiriesByStaffAsync(username));
    }

    [HttpPut("deactivate/{id}")]
    public async Task<IActionResult> Deactivate(int id)
    {
        // React sends 'text/plain', so we read body manually
        using var reader = new StreamReader(Request.Body);
        var reason = await reader.ReadToEndAsync();
        
        var result = await _enquiryService.DeactivateEnquiryAsync(id, reason);
        if (!result) return NotFound();
        return Ok("Deactivated");
    }

    [HttpPut("updateMessage/{id}")]
    public async Task<IActionResult> UpdateMessage(int id)
    {
        using var reader = new StreamReader(Request.Body);
        var message = await reader.ReadToEndAsync();

        var result = await _enquiryService.UpdateEnquiryMessageAsync(id, message);
        if (!result) return NotFound();
        return Ok("Updated");
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchEnquiry([FromQuery] string mobile)
    {
        var enquiry = await _enquiryService.GetEnquiryByMobileAsync(mobile);
        if (enquiry == null) return NotFound("Enquiry not found");
        if (enquiry.EnquiryIsActive == false) return BadRequest("Enquiry is closed/inactive. Cannot register student.");
        return Ok(enquiry);
    }
}
