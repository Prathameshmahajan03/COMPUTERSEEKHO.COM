using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ComputerSeekho.Net.Models;

[Table("staff")]
public class Staff
{
    [Key]
    [Column("staff_id")]
    public int StaffId { get; set; }

    [Column("staff_name")]
    [Required]
    public string StaffName { get; set; } = string.Empty;

    [Column("photo_url")]
    [Required]
    public string PhotoUrl { get; set; } = string.Empty;

    [Column("staff_email")]
    [Required]
    [EmailAddress]
    public string StaffEmail { get; set; } = string.Empty;

    [Column("staff_mobile")]
    [Required]
    public string StaffMobile { get; set; } = string.Empty;

    [Column("staff_gender")]
    [Required]
    public string StaffGender { get; set; } = string.Empty;

    [Column("staff_username")]
    [Required]
    [MaxLength(30)]
    public string StaffUsername { get; set; } = string.Empty;

    [Column("staff_password")]
    [Required]
    [MinLength(8)]
    // JsonIgnore for WriteOnly equivalent in separate DTOs usually, but for Entity direct use we can suppress serialization
    // [JsonIgnore] // Use DTOs for returning data to avoid sending password. Java used @JsonProperty(access = WRITE_ONLY)
    public string StaffPassword { get; set; } = string.Empty;

    [Column("staff_role")]
    public string? StaffRole { get; set; }
}
