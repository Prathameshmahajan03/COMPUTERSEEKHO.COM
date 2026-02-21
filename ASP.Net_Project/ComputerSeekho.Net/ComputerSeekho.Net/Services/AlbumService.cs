using Microsoft.EntityFrameworkCore;
using ComputerSeekho.Net.Data;
using ComputerSeekho.Net.Models;
using ComputerSeekho.Net.IServices;

namespace ComputerSeekho.Net.Services;

public class AlbumService : IAlbumService
{
    private readonly AppDbContext _context;
    public AlbumService(AppDbContext context) { _context = context; }

    public async Task<Album> AddAlbumAsync(Album album)
    {
        _context.Albums.Add(album);
        await _context.SaveChangesAsync();
        return album;
    }

    public async Task<List<Album>> GetAllAlbumsAsync()
    {
        return await _context.Albums.ToListAsync();
    }

    public async Task<bool> DeleteAlbumAsync(int id)
    {
        var item = await _context.Albums.FindAsync(id);
        if (item == null) return false;
        _context.Albums.Remove(item);
        await _context.SaveChangesAsync();
        return true;
    }
}
