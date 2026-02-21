using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ComputerSeekho.Net.Models;

[Table("recruiter")]
public class Recruiter
{
    [Key]
    [Column("recruiter_id")]
    [System.Text.Json.Serialization.JsonPropertyName("recruiterId")]
    public int RecruiterId { get; set; }

    [Column("recruiter_name")]
    [Required]
    [System.Text.Json.Serialization.JsonPropertyName("recruiterName")]
    public string RecruiterName { get; set; } = string.Empty;

    [Column("recruiter_location")]
    [System.Text.Json.Serialization.JsonPropertyName("recruiterLocation")]
    public string? RecruiterLocation { get; set; }

    [Column("recruiter_image")]
    [System.Text.Json.Serialization.JsonPropertyName("recruiterPhotoUrl")]
    public string? RecruiterPhotoUrl { get; set; }
}
