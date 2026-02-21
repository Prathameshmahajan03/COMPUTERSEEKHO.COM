using ComputerSeekho.Net.Models;

namespace ComputerSeekho.Net.IServices;

public interface IStaffService
{
    Task<Staff> AddStaffAsync(Staff staff);
    Task<List<Staff>> GetAllStaffAsync();
    Task<bool> DeleteStaffAsync(int id);
    Task<Staff?> GetStaffByUsernameAsync(string username);
    Task<Staff?> GetStaffByEmailAsync(string email);
}
