using ComputerSeekho.Net.Models;

namespace ComputerSeekho.Net.IServices;

public interface IPaymentTypeService
{
    Task<List<PaymentType>> GetAllAsync();
    Task<PaymentType> AddAsync(PaymentType item);
}
