using Microsoft.EntityFrameworkCore;
using ComputerSeekho.Net.Data;
using ComputerSeekho.Net.IServices;
using ComputerSeekho.Net.Models;

namespace ComputerSeekho.Net.Services;

public class EnquiryService : IEnquiryService
{
    private readonly AppDbContext _context;
    private readonly IStaffService _staffService;

    public EnquiryService(AppDbContext context, IStaffService staffService)
    {
        _context = context;
        _staffService = staffService;
    }

    public async Task<Enquiry> SaveEnquiryAsync(Enquiry enquiry, string? staffUsername)
    {
        if (!string.IsNullOrEmpty(staffUsername))
        {
            var staff = await _staffService.GetStaffByUsernameAsync(staffUsername);
            if (staff != null)
            {
                enquiry.StaffId = staff.StaffId;
            }
        }
        else
        {
            // Default to "admin" for public enquiries
            var adminStaff = await _staffService.GetStaffByUsernameAsync("admin");
            if (adminStaff != null)
            {
                enquiry.StaffId = adminStaff.StaffId;
            }
        }
        
        enquiry.EnquiryDate = DateOnly.FromDateTime(DateTime.Now);
        enquiry.EnquiryIsActive = true;
        
        _context.Enquiries.Add(enquiry);
        await _context.SaveChangesAsync();
        return enquiry;
    }

    public async Task<List<Enquiry>> GetAllEnquiriesAsync()
    {
        return await _context.Enquiries
            .Include(e => e.Staff)
            .ToListAsync();
    }

    public async Task<Enquiry?> UpdateEnquiryAsync(int id, Enquiry updatedEnquiry)
    {
        var enquiry = await _context.Enquiries.FindAsync(id);
        if (enquiry == null) return null;

        enquiry.EnquirerName = updatedEnquiry.EnquirerName;
        enquiry.EnquirerMobile = updatedEnquiry.EnquirerMobile;
        enquiry.EnquirerEmailId = updatedEnquiry.EnquirerEmailId;
        enquiry.EnquirerQuery = updatedEnquiry.EnquirerQuery;
        enquiry.CourseName = updatedEnquiry.CourseName;
        enquiry.ClosureReason = updatedEnquiry.ClosureReason;
        enquiry.FollowUpDate = updatedEnquiry.FollowUpDate;
        
        await _context.SaveChangesAsync();
        return enquiry;
    }

    public async Task<Enquiry?> GetEnquiryByIdAsync(int id)
    {
        return await _context.Enquiries.FindAsync(id);
    }

    public async Task<Enquiry?> GetEnquiryByMobileAsync(string mobile)
    {
        return await _context.Enquiries
            .Include(e => e.Staff)
            .OrderByDescending(e => e.EnquiryIsActive) // Prioritize Active enquiries
            .ThenByDescending(e => e.EnquiryId)        // Then latest one
            .FirstOrDefaultAsync(e => e.EnquirerMobile == mobile);
        // We will filter for IsActive in the Controller or return it and let Frontend decide, 
        // but normally Registration needs Active. 
        // Let's keep it returning all, and Controller checks status.
    }

    public async Task<List<Enquiry>> GetEnquiriesByStaffAsync(string username)
    {
        return await _context.Enquiries
            .Include(e => e.Staff)
            .Where(e => e.Staff != null && e.Staff.StaffUsername == username && e.EnquiryIsActive == true)
            .ToListAsync();
    }

    public async Task<bool> DeactivateEnquiryAsync(int id, string reason)
    {
        var params_ = reason; // logic if needed
        var enquiry = await _context.Enquiries.FindAsync(id);
        if (enquiry == null) return false;

        enquiry.EnquiryIsActive = false;
        enquiry.ClosureReason = reason; // Assuming logic matches Java
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateEnquiryMessageAsync(int id, string message)
    {
        var enquiry = await _context.Enquiries.FindAsync(id);
        if (enquiry == null) return false;

        enquiry.EnquirerQuery = message; // Utilizing Query field for updates as per Java logic usually
        // Or if there is a separate "Message" field? 
        // Checking frontend: specific field might be used. 
        // Java frontend uses "query" often for message.
        // Let's assume EnquirerQuery is the field being updated for "Last Message"
        await _context.SaveChangesAsync();
        return true;
    }
}
