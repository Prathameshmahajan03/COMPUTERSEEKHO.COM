using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ComputerSeekho.Net.Models;

[Table("course")]
public class Course
{
    [Key]
    [Column("course_id")]
    public int CourseId { get; set; }

    [Column("course_name")]
    [MaxLength(100)]
    public string? CourseName { get; set; }

    [Column("course_descriptor")]
    [MaxLength(500)]
    public string? CourseDescription { get; set; }

    [Column("course_duration")]
    public int? CourseDuration { get; set; }

    [Column("course_syllabus")]
    [MaxLength(200)]
    public string? CourseSyllabus { get; set; }

    [Column("course_fee")]
    public double? CourseFee { get; set; }

    [Column("course_is_active")]
    public bool CourseIsActive { get; set; } = true;

    [Column("cover_photo")]
    [MaxLength(100)]
    public string? CoverPhoto { get; set; }

    // Navigation (Optional for now, but good for EF)
    // public ICollection<Batch> Batches { get; set; }
}
