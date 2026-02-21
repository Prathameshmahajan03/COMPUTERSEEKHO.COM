using Microsoft.EntityFrameworkCore;
using ComputerSeekho.Net.Data;
using ComputerSeekho.Net.IServices;
using ComputerSeekho.Net.Models;

namespace ComputerSeekho.Net.Services;

public class PaymentService : IPaymentService
{
    private readonly AppDbContext _context;
    // Services needed for notification are better handled in Controller for separation, 
    // OR here if we want "Business Logic" to include notification. 
    // Java Controller often orchestrates. 
    // Let's put orchestration in Service to be "cleaner" but usually Pdf/Email return void/bytes.
    
    // Actually, generating the receipt Entity is the core service logic.
    // Sending Email is a side effect.
    // Let's inject helpers here to encapsulate "ProcessPayment" fully.
    
    private readonly IEmailService _emailService;
    private readonly IPdfService _pdfService;

    public PaymentService(AppDbContext context, IEmailService emailService, IPdfService pdfService)
    {
        _context = context;
        _emailService = emailService;
        _pdfService = pdfService;
    }

    public async Task<Receipt?> ProcessPaymentAsync(Payment payment)
    {
        // 1. Save Payment
        // Handle nested Student/PaymentType objects to avoid re-insertion
        if (payment.Student != null)
        {
            payment.StudentId = payment.Student.StudentId;
            payment.Student = null;
        }
        if (payment.PaymentType != null)
        {
            payment.PaymentTypeId = payment.PaymentType.PaymentTypeId;
            payment.PaymentType = null;
        }

        payment.PaymentDate = DateOnly.FromDateTime(DateTime.Now);
        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        // 2. Update Student Amount
        var student = await _context.Students
            .Include(s => s.Course)
            .FirstOrDefaultAsync(s => s.StudentId == payment.StudentId);
            
        if (student != null)
        {
            student.PaymentDue -= payment.Amount;
            await _context.SaveChangesAsync();
        }

        // 3. Create Receipt
        var receipt = new Receipt
        {
            PaymentId = payment.PaymentId,
            ReceiptAmount = payment.Amount,
            ReceiptDate = payment.PaymentDate
        };
        _context.Receipts.Add(receipt);
        await _context.SaveChangesAsync(); // Get ID

        // 4. Notify (PDF + Email)
        if (student != null)
        {
            try
            {
                var pdfBytes = _pdfService.GenerateReceiptPdf(receipt, student);
                if (!string.IsNullOrEmpty(student.StudentEmail))
                {
                    await _emailService.SendEmailAsync(
                        student.StudentEmail, 
                        "Payment Receipt - Computer Seekho", 
                        $"Dear {student.StudentName},\n\nThank you for your payment of {payment.Amount}. PFA receipt.",
                        pdfBytes,
                        $"Receipt_{receipt.ReceiptId}.pdf"
                    );
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Notification Failed: {ex.Message}");
            }
        }

        return receipt;
    }

    public async Task<List<Payment>> GetAllPaymentsAsync()
    {
        return await _context.Payments
            .Include(p => p.Student)
            .Include(p => p.PaymentType)
            .ToListAsync();
    }
}
