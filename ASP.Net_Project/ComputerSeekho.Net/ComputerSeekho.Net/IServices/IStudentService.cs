using ComputerSeekho.Net.Models;

namespace ComputerSeekho.Net.IServices;

public interface IStudentService
{
    Task<Student> RegisterStudentAsync(Student student, int enquiryId);
    Task<List<Student>> GetAllStudentsAsync();
    Task<Student?> GetStudentByIdAsync(int id);
}
