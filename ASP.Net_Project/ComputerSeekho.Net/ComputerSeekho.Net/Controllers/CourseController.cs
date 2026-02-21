using Microsoft.AspNetCore.Mvc;
using ComputerSeekho.Net.Models;
using ComputerSeekho.Net.IServices;

namespace ComputerSeekho.Net.Controllers;

[Route("course")]
[ApiController]
[Microsoft.AspNetCore.Authorization.AllowAnonymous]
public class CourseController : ControllerBase
{
    private readonly ICourseService _courseService;

    public CourseController(ICourseService courseService)
    {
        _courseService = courseService;
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddCourse([FromBody] Course course)
    {
        return Ok(await _courseService.AddCourseAsync(course));
    }

    [HttpGet("getAll")]
    public async Task<IActionResult> GetAllCourses()
    {
        return Ok(await _courseService.GetAllCoursesAsync());
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteCourse(int id)
    {
        var result = await _courseService.DeleteCourseAsync(id);
        if (!result) return BadRequest("Cannot delete course with active batches or students");
        return Ok("Course deleted");
    }
}
