using Microsoft.AspNetCore.Mvc;
using ComputerSeekho.Net.Models;
using ComputerSeekho.Net.IServices;

namespace ComputerSeekho.Net.Controllers;

[Route("closure-reason")]
[ApiController]
[Microsoft.AspNetCore.Authorization.AllowAnonymous]
public class ClosureReasonController : ControllerBase
{
    private readonly IClosureReasonService _service;
    public ClosureReasonController(IClosureReasonService service) { _service = service; }

    [HttpPost("add")]
    public async Task<IActionResult> Add([FromBody] ClosureReason item) => Ok(await _service.AddAsync(item));

    [HttpGet("getAll")]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());
}
