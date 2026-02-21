using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ComputerSeekho.Net.Models;

[Table("news")]
public class News
{
    [Key]
    [Column("News_id")]
    public int NewsId { get; set; }

    [Column("News_title")]
    public string? NewsTitle { get; set; }

    [Column("News_description")]
    public string? NewsDescription { get; set; }

    [Column("News_url")]
    public string? NewsUrl { get; set; }
}
