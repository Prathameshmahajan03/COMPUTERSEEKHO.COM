using ComputerSeekho.Net.Models;

namespace ComputerSeekho.Net.IServices;

public interface IAlbumService
{
    Task<Album> AddAlbumAsync(Album album);
    Task<List<Album>> GetAllAlbumsAsync();
    Task<bool> DeleteAlbumAsync(int id);
}
