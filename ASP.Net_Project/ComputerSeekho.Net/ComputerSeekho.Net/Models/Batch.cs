using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ComputerSeekho.Net.Models;

[Table("batch")]
public class Batch
{
    [Key]
    [Column("batch_id")]
    [System.Text.Json.Serialization.JsonPropertyName("batchId")]
    public int BatchId { get; set; }

    [Column("batch_name")]
    [System.Text.Json.Serialization.JsonPropertyName("batchName")]
    public string? BatchName { get; set; }

    [Column("batch_start_time")]
    [System.Text.Json.Serialization.JsonPropertyName("batchStartTime")]
    public DateOnly? BatchStartTime { get; set; }

    [Column("batch_end_time")]
    [System.Text.Json.Serialization.JsonPropertyName("batchEndTime")]
    public DateOnly? BatchEndTime { get; set; }

    [Column("batch_is_active")]
    [System.Text.Json.Serialization.JsonPropertyName("batchIsActive")]
    public bool? BatchIsActive { get; set; }

    [Column("batch_photo_url")]
    [System.Text.Json.Serialization.JsonPropertyName("batchPhoto")]
    public string? BatchPhoto { get; set; }

    [Column("course_id")]
    [System.Text.Json.Serialization.JsonIgnore]
    public int? CourseId { get; set; }

    [ForeignKey("CourseId")]
    [System.Text.Json.Serialization.JsonPropertyName("course")]
    [Microsoft.AspNetCore.Mvc.ModelBinding.Validation.ValidateNever]
    public virtual Course? Course { get; set; }
}
