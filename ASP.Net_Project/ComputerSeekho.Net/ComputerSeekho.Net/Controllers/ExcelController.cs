using Microsoft.AspNetCore.Mvc;
using ComputerSeekho.Net.Data;
using ComputerSeekho.Net.Services;
using ComputerSeekho.Net.Models;

namespace ComputerSeekho.Net.Controllers;

[Route("api/excel")]
[ApiController]
[Microsoft.AspNetCore.Authorization.AllowAnonymous]
public class ExcelController : ControllerBase
{
    private readonly ExcelService _excelService;
    private readonly AppDbContext _context;

    public ExcelController(AppDbContext context)
    {
        _context = context;
        _excelService = new ExcelService(context);
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadFile(IFormFile file, [FromForm] string type)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Please upload an excel file!");

        try
        {
            if (type == "enquiry") // Matching frontend type
            {
                await _excelService.SaveEnquiries(file);
                return Ok(new { message = "Uploaded the file successfully: " + file.FileName });
            }
            return BadRequest("Unknown Type");
        }
        catch (Exception e)
        {
            return StatusCode(500, new { message = "Could not upload the file: " + file.FileName + "! " + e.Message });
        }
    }

    [HttpGet("download")]
    public IActionResult DownloadSample()
    {
        var content = _excelService.GenerateSampleExcel();
        return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "enquiry_sample.xlsx");
    }
}
