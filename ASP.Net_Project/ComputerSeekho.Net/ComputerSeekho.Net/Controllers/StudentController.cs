using Microsoft.AspNetCore.Mvc;
using ComputerSeekho.Net.Models;
using ComputerSeekho.Net.IServices;

namespace ComputerSeekho.Net.Controllers;

[Route("student")]
[ApiController]
[Microsoft.AspNetCore.Authorization.AllowAnonymous]
public class StudentController : ControllerBase
{
    private readonly IStudentService _studentService;
    private readonly IPdfService _pdfService;

    public StudentController(IStudentService studentService, IPdfService pdfService)
    {
        _studentService = studentService;
        _pdfService = pdfService;
    }

    [HttpPost("add/{enquiryId}")]
    public async Task<IActionResult> RegisterStudent([FromBody] Student student, int enquiryId)
    {
        return Ok(await _studentService.RegisterStudentAsync(student, enquiryId));
    }

    [HttpGet("getAll")]
    public async Task<IActionResult> GetAllStudents()
    {
        return Ok(await _studentService.GetAllStudentsAsync());
    }

    [HttpGet("get/{id}")]
    public async Task<IActionResult> GetStudentById(int id)
    {
        var student = await _studentService.GetStudentByIdAsync(id);
        if (student == null) return NotFound();
        return Ok(student);
    }

    [HttpGet("pdf/{id}")]
    public async Task<IActionResult> DownloadProfile(int id)
    {
        try
        {
            var student = await _studentService.GetStudentByIdAsync(id);
            if (student == null) return NotFound("Student not found");

            var pdfBytes = _pdfService.GenerateStudentPdf(student);
            return File(pdfBytes, "application/pdf", $"StudentProfile_{id}.pdf");
        }
        catch (Exception ex)
        {
            return BadRequest($"PDF Generation Error: {ex.Message}");
        }
    }
}
