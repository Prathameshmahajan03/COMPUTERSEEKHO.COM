using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ComputerSeekho.Net.Models;

[Table("placement")]
public class Placement
{
    [Key]
    [Column("placement_id")]
    public int PlacementId { get; set; }

    [Column("student_id")]
    [System.Text.Json.Serialization.JsonIgnore]
    public int StudentId { get; set; }

    [ForeignKey("StudentId")]
    [System.Text.Json.Serialization.JsonPropertyName("studentID")]
    [Microsoft.AspNetCore.Mvc.ModelBinding.Validation.ValidateNever]
    public virtual Student? Student { get; set; }

    [Column("recruiter_id")]
    [System.Text.Json.Serialization.JsonIgnore]
    public int RecruiterId { get; set; }

    [ForeignKey("RecruiterId")]
    [System.Text.Json.Serialization.JsonPropertyName("recruiterID")]
    [Microsoft.AspNetCore.Mvc.ModelBinding.Validation.ValidateNever]
    public virtual Recruiter? Recruiter { get; set; }

    [Column("batch_id")]
    [System.Text.Json.Serialization.JsonIgnore]
    public int BatchId { get; set; }

    [ForeignKey("BatchId")]
    [System.Text.Json.Serialization.JsonPropertyName("batch")]
    [Microsoft.AspNetCore.Mvc.ModelBinding.Validation.ValidateNever]
    public virtual Batch? Batch { get; set; }
}
