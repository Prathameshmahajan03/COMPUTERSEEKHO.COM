using ComputerSeekho.Net.Models;

namespace ComputerSeekho.Net.IServices;

public interface ICourseService
{
    Task<Course> AddCourseAsync(Course course);
    Task<List<Course>> GetAllCoursesAsync();
    Task<bool> DeleteCourseAsync(int id);
    Task<Course?> GetCourseByIdAsync(int id);
}
