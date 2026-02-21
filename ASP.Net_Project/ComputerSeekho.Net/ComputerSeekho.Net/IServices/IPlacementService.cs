using ComputerSeekho.Net.Models;

namespace ComputerSeekho.Net.IServices;

public interface IPlacementService
{
    Task<List<Placement>> GetAllPlacementsAsync();
    Task<Placement> CreatePlacementAsync(Placement placement);
    Task<List<ComputerSeekho.Net.DTOs.PlacedStudentDto>> GetPlacedStudentByBatchIdAsync(int batchId);
    Task<List<ComputerSeekho.Net.DTOs.PlacedStudentDto>> GetPlacedStudentsByRecruiterIdAsync(int recruiterId);
}
