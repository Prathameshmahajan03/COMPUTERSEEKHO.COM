using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ComputerSeekho.Net.Models;

[Table("get_in_touch")]
public class GetInTouch
{
    [Key]
    [Column("get_in_touch_id")]
    public int GetInTouchId { get; set; }

    [Column("enquirer_name")]
    public string? EnquirerName { get; set; }

    [Column("enquirer_email")]
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress]
    public string? Email { get; set; }

    [Column("enquirer_mobile")]
    [Required(ErrorMessage = "Mobile number is required")]
    public string? Mobile { get; set; }

    [Column("enquirer_message")]
    public string? EnquiryMessage { get; set; }

    [Column("course_name")]
    public string? CourseName { get; set; }
}
