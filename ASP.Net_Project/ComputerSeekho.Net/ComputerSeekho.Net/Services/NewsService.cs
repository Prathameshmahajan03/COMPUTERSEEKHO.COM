using Microsoft.EntityFrameworkCore;
using ComputerSeekho.Net.Data;
using ComputerSeekho.Net.Models;
using ComputerSeekho.Net.IServices;

namespace ComputerSeekho.Net.Services;

public class NewsService : INewsService
{
    private readonly AppDbContext _context;
    public NewsService(AppDbContext context) { _context = context; }

    public async Task<News> AddNewsAsync(News news)
    {
        _context.News.Add(news);
        await _context.SaveChangesAsync();
        return news;
    }

    public async Task<List<News>> GetAllNewsAsync()
    {
        return await _context.News.ToListAsync();
    }

    public async Task<News?> GetLatestNewsAsync()
    {
        return await _context.News.OrderByDescending(n => n.NewsId).FirstOrDefaultAsync();
    }
}
