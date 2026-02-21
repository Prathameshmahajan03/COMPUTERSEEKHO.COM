using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ComputerSeekho.Net.Models;

[Table("video_master")]
public class Video
{
    [Key]
    [Column("video_id")]
    public int VideoId { get; set; }

    [Column("video_description")]
    [MaxLength(60)]
    public string? VideoDescription { get; set; }

    [Column("video_url")]
    [MaxLength(255)]
    public string? VideoUrl { get; set; }

    [Column("batch_id")]
    public int? BatchId { get; set; }

    [ForeignKey("BatchId")]
    public virtual Batch? Batch { get; set; }

    [Column("start_date")]
    public DateOnly? StartDate { get; set; }

    [Column("end_date")]
    public DateOnly? EndDate { get; set; }

    [Column("is_active")]
    public bool VideoIsActive { get; set; }

    [Column("course_id")]
    public int? CourseId { get; set; }

    [ForeignKey("CourseId")]
    public virtual Course? Course { get; set; }
}
