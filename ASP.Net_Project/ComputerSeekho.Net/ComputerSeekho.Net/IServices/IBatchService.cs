using ComputerSeekho.Net.Models;

namespace ComputerSeekho.Net.IServices;

public interface IBatchService
{
    Task<Batch> AddBatchAsync(Batch batch);
    Task<List<Batch>> GetAllBatchesAsync();
    Task<bool> DeleteBatchAsync(int id);
    Task<Batch?> ToggleBatchStatusAsync(int id, bool status);
}
