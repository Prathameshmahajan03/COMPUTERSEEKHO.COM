using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ComputerSeekho.Net.Models;

[Table("student")]
public class Student
{
    [Key]
    [Column("student_id")]
    [System.Text.Json.Serialization.JsonPropertyName("studentId")]
    public int StudentId { get; set; }

    [Column("payment_due")]
    [System.Text.Json.Serialization.JsonPropertyName("paymentDue")]
    public double? PaymentDue { get; set; }

    [Column("student_name")]
    [Required]
    [MaxLength(30)]
    [System.Text.Json.Serialization.JsonPropertyName("studentName")]
    public string StudentName { get; set; } = string.Empty;

    [Column("student_address")]
    [MaxLength(60)]
    [System.Text.Json.Serialization.JsonPropertyName("studentAddress")]
    public string? StudentAddress { get; set; }

    [Column("student_gender")]
    [MaxLength(10)]
    [System.Text.Json.Serialization.JsonPropertyName("studentGender")]
    public string? StudentGender { get; set; }

    [Column("photo_url")]
    [MaxLength(255)]
    [System.Text.Json.Serialization.JsonPropertyName("photoUrl")]
    public string? PhotoUrl { get; set; }

    [Column("student_dob")]
    [System.Text.Json.Serialization.JsonPropertyName("studentDob")]
    public DateOnly? StudentDob { get; set; }

    [Column("student_qualification")]
    [MaxLength(20)]
    [System.Text.Json.Serialization.JsonPropertyName("studentQualification")]
    public string? StudentQualification { get; set; }

    [Column("student_mobile")]
    [System.Text.Json.Serialization.JsonPropertyName("studentMobile")]
    public string? StudentMobile { get; set; }

    [Column("student_email")]
    [MaxLength(30)]
    [System.Text.Json.Serialization.JsonPropertyName("studentEmail")]
    public string? StudentEmail { get; set; }

    [Column("batch_id")]
    [System.Text.Json.Serialization.JsonIgnore]
    public int? BatchId { get; set; }

    [ForeignKey("BatchId")]
    [System.Text.Json.Serialization.JsonPropertyName("batch")]
    public virtual Batch? Batch { get; set; }

    [Column("course_id")]
    [System.Text.Json.Serialization.JsonIgnore]
    public int? CourseId { get; set; }

    [ForeignKey("CourseId")]
    [System.Text.Json.Serialization.JsonPropertyName("course")]
    public virtual Course? Course { get; set; }
}
