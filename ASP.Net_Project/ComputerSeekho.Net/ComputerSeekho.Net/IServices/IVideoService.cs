using ComputerSeekho.Net.Models;

namespace ComputerSeekho.Net.IServices;

public interface IVideoService
{
    Task<Video> AddVideoAsync(Video video);
    Task<List<Video>> GetAllVideosAsync();
    Task<bool> DeleteVideoAsync(int id);
}
