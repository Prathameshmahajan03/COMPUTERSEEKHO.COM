using Microsoft.AspNetCore.Mvc;
using ComputerSeekho.Net.IServices;

namespace ComputerSeekho.Net.Controllers;

[Route("placement")]
[ApiController]
[Microsoft.AspNetCore.Authorization.AllowAnonymous]
public class PlacementController : ControllerBase
{
    private readonly IPlacementService _service;
    public PlacementController(IPlacementService service) { _service = service; }

    [HttpGet("all")]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllPlacementsAsync());

    [HttpPost("add")]
    public async Task<IActionResult> Add([FromBody] ComputerSeekho.Net.Models.Placement placement)
    {
        return Ok(await _service.CreatePlacementAsync(placement));
    }

    [HttpGet("getByBatch/{batchId}")]
    public async Task<IActionResult> GetByBatch(int batchId)
    {
        var result = await _service.GetPlacedStudentByBatchIdAsync(batchId);
        if (result == null || result.Count == 0) return NotFound();
        return Ok(result);
    }

    [HttpGet("getByRecruiter/{recruiterId}")]
    public async Task<IActionResult> GetByRecruiter(int recruiterId)
    {
        var result = await _service.GetPlacedStudentsByRecruiterIdAsync(recruiterId);
        if (result == null || result.Count == 0) return NotFound();
        return Ok(result);
    }
}
