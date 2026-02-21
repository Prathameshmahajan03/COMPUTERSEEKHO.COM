using Microsoft.EntityFrameworkCore;
using ComputerSeekho.Net.Data;
using ComputerSeekho.Net.IServices;
using ComputerSeekho.Net.Models;

namespace ComputerSeekho.Net.Services;

public class BatchService : IBatchService
{
    private readonly AppDbContext _context;

    public BatchService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Batch> AddBatchAsync(Batch batch)
    {
        if (batch.Course != null)
        {
            batch.CourseId = batch.Course.CourseId;
            batch.Course = null;
        }
        _context.Batches.Add(batch);
        await _context.SaveChangesAsync();
        return batch;
    }

    public async Task<List<Batch>> GetAllBatchesAsync()
    {
        // Include Course as per previous controller logic
        return await _context.Batches.Include(b => b.Course).ToListAsync();
    }

    public async Task<bool> DeleteBatchAsync(int id)
    {
        var batch = await _context.Batches.FindAsync(id);
        if (batch == null) return false;

        _context.Batches.Remove(batch);
        try
        {
            await _context.SaveChangesAsync();
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<Batch?> ToggleBatchStatusAsync(int id, bool status)
    {
        var batch = await _context.Batches.FindAsync(id);
        if (batch == null) return null;

        batch.BatchIsActive = status;
        await _context.SaveChangesAsync();
        return batch;
    }
}
