using Microsoft.EntityFrameworkCore;
using ComputerSeekho.Net.Data;
using ComputerSeekho.Net.Models;
using ComputerSeekho.Net.IServices;

namespace ComputerSeekho.Net.Services;

public class PlacementService : IPlacementService
{
    private readonly AppDbContext _context;
    public PlacementService(AppDbContext context) { _context = context; }

    public async Task<List<Placement>> GetAllPlacementsAsync()
    {
        return await _context.Placements
            .Include(p => p.Student)
            .Include(p => p.Recruiter)
            .Include(p => p.Batch)
            .ToListAsync();
    }

    public async Task<Placement> CreatePlacementAsync(Placement placement)
    {
        // Handle nested objects: extract IDs and set nav props to null
        if (placement.Student != null)
        {
            placement.StudentId = placement.Student.StudentId;
            placement.Student = null;
        }
        if (placement.Recruiter != null)
        {
            placement.RecruiterId = placement.Recruiter.RecruiterId;
            placement.Recruiter = null;
        }
        if (placement.Batch != null)
        {
            placement.BatchId = placement.Batch.BatchId;
            placement.Batch = null;
        }

        // Validate Student Fees
        var student = await _context.Students.FindAsync(placement.StudentId);
        if (student != null && student.PaymentDue > 0)
        {
            throw new InvalidOperationException("Cannot place student with pending fees.");
        }

        _context.Placements.Add(placement);
        await _context.SaveChangesAsync();
        return placement;
    }

    public async Task<List<ComputerSeekho.Net.DTOs.PlacedStudentDto>> GetPlacedStudentByBatchIdAsync(int batchId)
    {
        return await _context.Placements
            .Where(p => p.BatchId == batchId)
            .Include(p => p.Batch)
            .Include(p => p.Student)
            .Include(p => p.Recruiter)
            .Select(p => new ComputerSeekho.Net.DTOs.PlacedStudentDto
            {
                BatchId = p.BatchId,
                BatchName = p.Batch != null ? p.Batch.BatchName : "",
                StudentName = p.Student != null ? p.Student.StudentName : "",
                PhotoUrl = p.Student != null ? p.Student.PhotoUrl : "",
                RecruiterName = p.Recruiter != null ? p.Recruiter.RecruiterName : ""
            })
            .ToListAsync();
    }

    public async Task<List<ComputerSeekho.Net.DTOs.PlacedStudentDto>> GetPlacedStudentsByRecruiterIdAsync(int recruiterId)
    {
        return await _context.Placements
            .Where(p => p.RecruiterId == recruiterId)
            .Include(p => p.Batch)
            .Include(p => p.Student)
            .Include(p => p.Recruiter)
            .Select(p => new ComputerSeekho.Net.DTOs.PlacedStudentDto
            {
                BatchId = p.BatchId,
                BatchName = p.Batch != null ? p.Batch.BatchName : "",
                StudentName = p.Student != null ? p.Student.StudentName : "",
                PhotoUrl = p.Student != null ? p.Student.PhotoUrl : "",
                RecruiterName = p.Recruiter != null ? p.Recruiter.RecruiterName : ""
            })
            .ToListAsync();
    }
}
