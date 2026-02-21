using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ComputerSeekho.Net.Models;

[Table("payment_type")]
public class PaymentType
{
    [Key]
    [Column("payment_type_id")]
    [System.Text.Json.Serialization.JsonPropertyName("paymentTypeId")]
    public int PaymentTypeId { get; set; }

    [Column("payment_type_desc")]
    [System.Text.Json.Serialization.JsonPropertyName("paymentTypeDesc")]
    public string? PaymentTypeDesc { get; set; }
}
