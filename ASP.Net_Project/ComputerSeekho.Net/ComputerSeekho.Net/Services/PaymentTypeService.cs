using Microsoft.EntityFrameworkCore;
using ComputerSeekho.Net.Data;
using ComputerSeekho.Net.Models;
using ComputerSeekho.Net.IServices;

namespace ComputerSeekho.Net.Services;

public class PaymentTypeService : IPaymentTypeService
{
    private readonly AppDbContext _context;
    public PaymentTypeService(AppDbContext context) { _context = context; }

    public async Task<List<PaymentType>> GetAllAsync() => await _context.PaymentTypes.ToListAsync();
    public async Task<PaymentType> AddAsync(PaymentType item) {
        _context.PaymentTypes.Add(item);
        await _context.SaveChangesAsync();
        return item;
    }
}
