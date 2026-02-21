using Microsoft.AspNetCore.Mvc;
using ComputerSeekho.Net.Models;
using ComputerSeekho.Net.IServices;

namespace ComputerSeekho.Net.Controllers;

[Route("Video")]
[ApiController]
[Microsoft.AspNetCore.Authorization.AllowAnonymous]
public class VideoController : ControllerBase
{
    private readonly IVideoService _service;
    public VideoController(IVideoService service) { _service = service; }

    [HttpPost("add")]
    public async Task<IActionResult> Add([FromBody] Video item) => Ok(await _service.AddVideoAsync(item));

    [HttpGet("getAll")]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllVideosAsync());

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(int id) => await _service.DeleteVideoAsync(id) ? Ok("Deleted") : NotFound();
}
