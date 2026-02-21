using Microsoft.AspNetCore.Mvc;
using ComputerSeekho.Net.Models;
using ComputerSeekho.Net.IServices;

namespace ComputerSeekho.Net.Controllers;

[Route("getintouch")]
[ApiController]
[Microsoft.AspNetCore.Authorization.AllowAnonymous]
public class GetInTouchController : ControllerBase
{
    private readonly IGetInTouchService _service;
    public GetInTouchController(IGetInTouchService service) { _service = service; }

    [HttpPost("add")]
    public async Task<IActionResult> Add([FromBody] GetInTouch item) => Ok(await _service.AddAsync(item));

    [HttpGet("getAll")]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(int id) => await _service.DeleteAsync(id) ? Ok("Deleted") : NotFound();
}
