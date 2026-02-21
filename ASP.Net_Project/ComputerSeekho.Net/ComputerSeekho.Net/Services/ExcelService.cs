using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using ComputerSeekho.Net.Models;
using Microsoft.EntityFrameworkCore;
using ComputerSeekho.Net.Data;

namespace ComputerSeekho.Net.Services;

public class ExcelService
{
    private readonly AppDbContext _context;

    public ExcelService(AppDbContext context)
    {
        _context = context;
    }

    public async Task SaveEnquiries(IFormFile file)
    {
        using var stream = file.OpenReadStream();
        IWorkbook workbook = new XSSFWorkbook(stream);
        ISheet sheet = workbook.GetSheetAt(0);
        
        var enquiries = new List<Enquiry>();
        var date = DateOnly.FromDateTime(DateTime.Now);

        // Fetch Admin Staff to assign enquiries
        var adminStaff = await _context.Staff.FirstOrDefaultAsync(s => s.StaffUsername == "admin");
        int? adminId = adminStaff?.StaffId;

        // Iterate rows (Skip header usually, row 0)
        for (int i = 1; i <= sheet.LastRowNum; i++)
        {
            IRow row = sheet.GetRow(i);
            if (row == null) continue;

            // Mapping columns based on typical ExcelHelper logic
            // 0: Name, 1: Mobile, 2: Email, 3: Query, 4: Course
            
            try 
            {
                var enquiry = new Enquiry
                {
                    EnquirerName = GetCellValue(row.GetCell(0)),
                    EnquirerMobile = GetCellValue(row.GetCell(1)),
                    EnquirerEmailId = GetCellValue(row.GetCell(2)),
                    EnquirerQuery = GetCellValue(row.GetCell(3)),
                    CourseName = GetCellValue(row.GetCell(4)),
                    EnquiryDate = date,
                    EnquiryIsActive = true,
                    ClosureReason = "Pending",
                    FollowUpDate = date.AddDays(2),
                    StaffId = adminId // Auto-assign to admin
                };

                // Basic validation
                if (!string.IsNullOrEmpty(enquiry.EnquirerName) && !string.IsNullOrEmpty(enquiry.EnquirerMobile))
                {
                    enquiries.Add(enquiry);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error parsing row {i}: {ex.Message}");
            }
        }

        if (enquiries.Any())
        {
            await _context.Enquiries.AddRangeAsync(enquiries);
            await _context.SaveChangesAsync();
        }
    }

    public byte[] GenerateSampleExcel()
    {
        using (var stream = new MemoryStream())
        {
            IWorkbook workbook = new XSSFWorkbook();
            ISheet sheet = workbook.CreateSheet("EnquirySample");
            IRow headerRow = sheet.CreateRow(0);

            headerRow.CreateCell(0).SetCellValue("Enquirer Name");
            headerRow.CreateCell(1).SetCellValue("Mobile");
            headerRow.CreateCell(2).SetCellValue("Email");
            headerRow.CreateCell(3).SetCellValue("Message");
            headerRow.CreateCell(4).SetCellValue("Course Name");

            workbook.Write(stream);
            return stream.ToArray();
        }
    }

    private string? GetCellValue(ICell? cell)
    {
        if (cell == null) return null;
        cell.SetCellType(CellType.String);
        return cell.StringCellValue;
    }
}
