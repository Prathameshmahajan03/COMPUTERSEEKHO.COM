using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ComputerSeekho.Net.Models;

[Table("albums")]
public class Album
{
    [Key]
    [Column("album_id")]
    public int AlbumId { get; set; }

    [Column("album_name")]
    [Required]
    public string AlbumName { get; set; } = string.Empty;

    [Column("album_description")]
    public string? AlbumDescription { get; set; }

    [Column("start_date")]
    public DateOnly? StartDate { get; set; }

    [Column("end_date")]
    public DateOnly? EndDate { get; set; }

    [Column("is_active")]
    public bool AlbumIsActive { get; set; }
}
