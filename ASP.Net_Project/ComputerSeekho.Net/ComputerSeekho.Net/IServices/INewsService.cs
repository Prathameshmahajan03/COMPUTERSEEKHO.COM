using ComputerSeekho.Net.Models;

namespace ComputerSeekho.Net.IServices;

public interface INewsService
{
    Task<News> AddNewsAsync(News news);
    Task<List<News>> GetAllNewsAsync();
    Task<News?> GetLatestNewsAsync();
}
