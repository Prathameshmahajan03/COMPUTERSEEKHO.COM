using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ComputerSeekho.Net.Models;

[Table("enquiry")]
public class Enquiry
{
    [Key]
    [Column("enquiry_id")]
    [System.Text.Json.Serialization.JsonPropertyName("enquiryId")]
    public int EnquiryId { get; set; }

    [Column("enquirer_name")]
    [System.Text.Json.Serialization.JsonPropertyName("enquirerName")]
    public string? EnquirerName { get; set; }

    [Column("enquirer_address")]
    [System.Text.Json.Serialization.JsonPropertyName("enquirerAddress")]
    public string? EnquirerAddress { get; set; }

    [Column("enquirer_mobile")]
    [System.Text.Json.Serialization.JsonPropertyName("enquirerMobile")]
    public string? EnquirerMobile { get; set; }

    [Column("enquirer_email_id")]
    [System.Text.Json.Serialization.JsonPropertyName("enquirerEmailId")]
    public string? EnquirerEmailId { get; set; }

    [Column("enquiry_date")]
    [System.Text.Json.Serialization.JsonPropertyName("enquiryDate")]
    public DateOnly? EnquiryDate { get; set; }

    [Column("enquirer_query")]
    [System.Text.Json.Serialization.JsonPropertyName("enquirerQuery")]
    public string? EnquirerQuery { get; set; }

    [Column("course_name")]
    [System.Text.Json.Serialization.JsonPropertyName("courseName")]
    public string? CourseName { get; set; }

    [Column("student_name")]
    [System.Text.Json.Serialization.JsonPropertyName("studentName")]
    public string? StudentName { get; set; }

    [Column("closure_reason")]
    [System.Text.Json.Serialization.JsonPropertyName("closureReason")]
    public string? ClosureReason { get; set; }

    [Column("follow_up_date")]
    [System.Text.Json.Serialization.JsonPropertyName("followUpDate")]
    public DateOnly? FollowUpDate { get; set; }

    [Column("enquiry_is_active")]
    [System.Text.Json.Serialization.JsonPropertyName("enquiryIsActive")]
    public bool? EnquiryIsActive { get; set; } = true;

    [Column("enquiry_counter")]
    [System.Text.Json.Serialization.JsonPropertyName("enquiryCounter")]
    public int? EnquiryCounter { get; set; }

    [Column("staff_id")]
    [System.Text.Json.Serialization.JsonIgnore]
    public int? StaffId { get; set; }

    [ForeignKey("StaffId")]
    [System.Text.Json.Serialization.JsonPropertyName("staff")]
    public virtual Staff? Staff { get; set; }
}
