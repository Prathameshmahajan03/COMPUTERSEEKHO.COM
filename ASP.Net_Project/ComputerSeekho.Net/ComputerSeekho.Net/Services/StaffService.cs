using Microsoft.EntityFrameworkCore;
using ComputerSeekho.Net.Data;
using ComputerSeekho.Net.IServices;
using ComputerSeekho.Net.Models;
using ComputerSeekho.Net.Utility;

namespace ComputerSeekho.Net.Services;

public class StaffService : IStaffService
{
    private readonly AppDbContext _context;

    public StaffService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Staff> AddStaffAsync(Staff staff)
    {
        // Hash Password handled by implementation, or controller? 
        // Logic was in Controller, moving here is cleaner but existing controller had checks.
        // Let's keep logic here primarily.
        
        staff.StaffPassword = PasswordHelper.HashPassword(staff.StaffPassword);
        _context.Staff.Add(staff);
        await _context.SaveChangesAsync();
        return staff;
    }

    public async Task<List<Staff>> GetAllStaffAsync()
    {
        return await _context.Staff.ToListAsync();
    }

    public async Task<bool> DeleteStaffAsync(int id)
    {
        var staff = await _context.Staff.FindAsync(id);
        if (staff == null) return false;

        _context.Staff.Remove(staff);
        try
        {
            await _context.SaveChangesAsync();
            return true;
        }
        catch (DbUpdateException)
        {
            return false;
        }
    }

    public async Task<Staff?> GetStaffByUsernameAsync(string username)
    {
        return await _context.Staff.FirstOrDefaultAsync(s => s.StaffUsername == username);
    }
    
    public async Task<Staff?> GetStaffByEmailAsync(string email)
    {
        return await _context.Staff.FirstOrDefaultAsync(s => s.StaffEmail == email);
    }
}
