using ComputerSeekho.Net.Models;

namespace ComputerSeekho.Net.IServices;

public interface IPdfService
{
    byte[] GenerateStudentPdf(Student student);
    byte[] GenerateReceiptPdf(Receipt receipt, Student student);
}
