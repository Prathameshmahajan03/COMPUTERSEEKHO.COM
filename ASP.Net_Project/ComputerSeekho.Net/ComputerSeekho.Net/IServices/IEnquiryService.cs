using ComputerSeekho.Net.Models;

namespace ComputerSeekho.Net.IServices;

public interface IEnquiryService
{
    Task<Enquiry> SaveEnquiryAsync(Enquiry enquiry, string? staffUsername);
    Task<List<Enquiry>> GetAllEnquiriesAsync();
    Task<Enquiry?> UpdateEnquiryAsync(int id, Enquiry enquiry);
    Task<Enquiry?> GetEnquiryByIdAsync(int id);
    Task<Enquiry?> GetEnquiryByMobileAsync(string mobile);
    Task<List<Enquiry>> GetEnquiriesByStaffAsync(string username);
    Task<bool> DeactivateEnquiryAsync(int id, string reason);
    Task<bool> UpdateEnquiryMessageAsync(int id, string message);
}
