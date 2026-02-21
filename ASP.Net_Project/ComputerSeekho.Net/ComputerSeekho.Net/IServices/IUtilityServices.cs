using ComputerSeekho.Net.Models;

namespace ComputerSeekho.Net.IServices;

public interface IGetInTouchService
{
    Task<GetInTouch> AddAsync(GetInTouch item);
    Task<List<GetInTouch>> GetAllAsync();
    Task<bool> DeleteAsync(int id);
}

public interface IClosureReasonService
{
    Task<ClosureReason> AddAsync(ClosureReason item);
    Task<List<ClosureReason>> GetAllAsync();
}
