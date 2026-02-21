using Microsoft.EntityFrameworkCore;
using ComputerSeekho.Net.Data;
using ComputerSeekho.Net.Models;
using ComputerSeekho.Net.IServices;

namespace ComputerSeekho.Net.Services;

public class GetInTouchService : IGetInTouchService
{
    private readonly AppDbContext _context;
    public GetInTouchService(AppDbContext context) { _context = context; }

    public async Task<GetInTouch> AddAsync(GetInTouch item)
    {
        _context.GetInTouch.Add(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task<List<GetInTouch>> GetAllAsync()
    {
        return await _context.GetInTouch.ToListAsync();
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var item = await _context.GetInTouch.FindAsync(id);
        if (item == null) return false;
        _context.GetInTouch.Remove(item);
        await _context.SaveChangesAsync();
        return true;
    }
}

public class ClosureReasonService : IClosureReasonService
{
    private readonly AppDbContext _context;
    public ClosureReasonService(AppDbContext context) { _context = context; }

    public async Task<ClosureReason> AddAsync(ClosureReason item)
    {
        _context.ClosureReasons.Add(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task<List<ClosureReason>> GetAllAsync()
    {
        return await _context.ClosureReasons.ToListAsync();
    }
}
