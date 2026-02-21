using Microsoft.EntityFrameworkCore;
using ComputerSeekho.Net.Data;
using ComputerSeekho.Net.IServices;
using ComputerSeekho.Net.Models;

namespace ComputerSeekho.Net.Services;

public class StudentService : IStudentService
{
    private readonly AppDbContext _context;

    public StudentService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Student> RegisterStudentAsync(Student student, int enquiryId)
    {
        // Fix for 500 Error: Handle nested Course/Batch objects
        // Frontend sends { course: { courseId: 1 }, ... } which might act as new entity insertion.
        // We extract IDs and set navigation properties to null to avoid EF conflicts.
        if (student.Batch != null)
        {
            student.BatchId = student.Batch.BatchId;
            student.Batch = null; // Prevent re-insertion
        }
        if (student.Course != null)
        {
            student.CourseId = student.Course.CourseId;
            student.Course = null; // Prevent re-insertion
        }

        if (enquiryId > 0)
        {
            var enquiry = await _context.Enquiries.FindAsync(enquiryId);
            if (enquiry != null)
            {
                enquiry.ClosureReason = "Admitted";
                enquiry.EnquiryIsActive = false;
            }
        }

        _context.Students.Add(student);
        await _context.SaveChangesAsync();
        return student;
    }

    public async Task<List<Student>> GetAllStudentsAsync()
    {
        return await _context.Students
            .Include(s => s.Course)
            .Include(s => s.Batch)
            .ToListAsync();
    }

    public async Task<Student?> GetStudentByIdAsync(int id)
    {
         return await _context.Students
            .Include(s => s.Course)
            .Include(s => s.Batch)
            .FirstOrDefaultAsync(s => s.StudentId == id);
    }
}
