using Microsoft.EntityFrameworkCore;
using ComputerSeekho.Net.Data;
using ComputerSeekho.Net.Models;
using ComputerSeekho.Net.IServices;

namespace ComputerSeekho.Net.Services;

public class VideoService : IVideoService
{
    private readonly AppDbContext _context;
    public VideoService(AppDbContext context) { _context = context; }

    public async Task<Video> AddVideoAsync(Video video)
    {
        _context.Videos.Add(video);
        await _context.SaveChangesAsync();
        return video;
    }

    public async Task<List<Video>> GetAllVideosAsync()
    {
        return await _context.Videos.Include(v => v.Course).Include(v => v.Batch).ToListAsync();
    }

    public async Task<bool> DeleteVideoAsync(int id)
    {
        var item = await _context.Videos.FindAsync(id);
        if (item == null) return false;
        _context.Videos.Remove(item);
        await _context.SaveChangesAsync();
        return true;
    }
}
