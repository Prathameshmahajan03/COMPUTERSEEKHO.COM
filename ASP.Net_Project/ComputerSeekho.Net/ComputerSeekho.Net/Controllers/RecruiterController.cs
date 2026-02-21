using Microsoft.AspNetCore.Mvc;
using ComputerSeekho.Net.Models;
using ComputerSeekho.Net.IServices;

namespace ComputerSeekho.Net.Controllers;

[Route("recruiter")]
[ApiController]
[Microsoft.AspNetCore.Authorization.AllowAnonymous]
public class RecruiterController : ControllerBase
{
    private readonly IRecruiterService _service;
    public RecruiterController(IRecruiterService service) { _service = service; }

    [HttpPost("add")]
    public async Task<IActionResult> Add([FromBody] Recruiter item) => Ok(await _service.AddRecruiterAsync(item));

    [HttpGet("getAll")]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllRecruitersAsync());

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        return await _service.DeleteRecruiterAsync(id) ? Ok("Deleted") : BadRequest("Linked Data Exists");
    }
}
