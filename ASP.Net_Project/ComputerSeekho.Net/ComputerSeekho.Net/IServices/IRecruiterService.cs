using ComputerSeekho.Net.Models;

namespace ComputerSeekho.Net.IServices;

public interface IRecruiterService
{
    Task<Recruiter> AddRecruiterAsync(Recruiter recruiter);
    Task<List<Recruiter>> GetAllRecruitersAsync();
    Task<bool> DeleteRecruiterAsync(int id);
}
