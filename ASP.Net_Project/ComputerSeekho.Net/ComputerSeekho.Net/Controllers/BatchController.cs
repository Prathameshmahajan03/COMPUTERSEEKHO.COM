using Microsoft.AspNetCore.Mvc;
using ComputerSeekho.Net.Models;
using ComputerSeekho.Net.IServices;

namespace ComputerSeekho.Net.Controllers;

[Route("batch")]
[ApiController]
[Microsoft.AspNetCore.Authorization.AllowAnonymous]
public class BatchController : ControllerBase
{
    private readonly IBatchService _batchService;

    public BatchController(IBatchService batchService)
    {
        _batchService = batchService;
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddBatch([FromBody] Batch batch)
    {
        return Ok(await _batchService.AddBatchAsync(batch));
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllBatches()
    {
        return Ok(await _batchService.GetAllBatchesAsync());
    }

    [HttpGet("get/all/activebatch")]
    public async Task<IActionResult> GetActiveBatches()
    {
        var all = await _batchService.GetAllBatchesAsync();
        return Ok(all.Where(b => b.BatchIsActive == true).ToList());
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteBatch(int id)
    {
        var result = await _batchService.DeleteBatchAsync(id);
        if (!result) return BadRequest("Linked Data Exists");
        return Ok("Deleted");
    }

    [HttpPut("activate/{id}/{status}")]
    public async Task<IActionResult> ToggleStatus(int id, bool status)
    {
        var batch = await _batchService.ToggleBatchStatusAsync(id, status);
        if (batch == null) return NotFound();
        return Ok(batch);
    }
}
