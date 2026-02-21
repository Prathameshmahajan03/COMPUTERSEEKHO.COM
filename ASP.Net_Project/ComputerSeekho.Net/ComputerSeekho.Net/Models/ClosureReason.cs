using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ComputerSeekho.Net.Models;

[Table("closure_reason")]
public class ClosureReason
{
    [Key]
    [Column("closure_reason_id")]
    public int ClosureReasonId { get; set; }

    [Column("closure_reason_desc")]
    public string? ClosureReasonDesc { get; set; }

    [Column("enquirer_name")]
    public string? EnquirerName { get; set; }
}
