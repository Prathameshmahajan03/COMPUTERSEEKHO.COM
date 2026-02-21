using Microsoft.AspNetCore.Mvc;
using ComputerSeekho.Net.Models;
using ComputerSeekho.Net.IServices;

namespace ComputerSeekho.Net.Controllers;

[Route("News")]
[ApiController]
[Microsoft.AspNetCore.Authorization.AllowAnonymous]
public class NewsController : ControllerBase
{
    private readonly INewsService _service;
    public NewsController(INewsService service) { _service = service; }

    [HttpPost("add")]
    public async Task<IActionResult> Add([FromBody] News item) => Ok(await _service.AddNewsAsync(item));

    [HttpGet("all")]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllNewsAsync());

    [HttpGet("latest")]
    public async Task<IActionResult> GetLatest()
    {
         var news = await _service.GetLatestNewsAsync();
         if (news == null) return NotFound("No announcements found");
         return Ok(news);
    }
}
