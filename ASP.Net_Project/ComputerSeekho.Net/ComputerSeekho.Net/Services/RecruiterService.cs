using Microsoft.EntityFrameworkCore;
using ComputerSeekho.Net.Data;
using ComputerSeekho.Net.Models;
using ComputerSeekho.Net.IServices;

namespace ComputerSeekho.Net.Services;

public class RecruiterService : IRecruiterService
{
    private readonly AppDbContext _context;
    public RecruiterService(AppDbContext context) { _context = context; }

    public async Task<Recruiter> AddRecruiterAsync(Recruiter recruiter)
    {
        _context.Recruiters.Add(recruiter);
        await _context.SaveChangesAsync();
        return recruiter;
    }

    public async Task<List<Recruiter>> GetAllRecruitersAsync()
    {
        return await _context.Recruiters.ToListAsync();
    }

    public async Task<bool> DeleteRecruiterAsync(int id)
    {
        var item = await _context.Recruiters.FindAsync(id);
        if (item == null) return false;
        _context.Recruiters.Remove(item);
        try { await _context.SaveChangesAsync(); return true; } catch { return false; }
    }
}
