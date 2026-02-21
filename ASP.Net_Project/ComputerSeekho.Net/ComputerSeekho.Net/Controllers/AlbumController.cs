using Microsoft.AspNetCore.Mvc;
using ComputerSeekho.Net.Models;
using ComputerSeekho.Net.IServices;

namespace ComputerSeekho.Net.Controllers;

[Route("Album")]
[ApiController]
[Microsoft.AspNetCore.Authorization.AllowAnonymous]
public class AlbumController : ControllerBase
{
    private readonly IAlbumService _service;
    public AlbumController(IAlbumService service) { _service = service; }

    [HttpPost("add")]
    public async Task<IActionResult> Add([FromBody] Album item) => Ok(await _service.AddAlbumAsync(item));

    [HttpGet("getAll")]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAlbumsAsync());

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(int id) => await _service.DeleteAlbumAsync(id) ? Ok("Deleted") : NotFound();
}
