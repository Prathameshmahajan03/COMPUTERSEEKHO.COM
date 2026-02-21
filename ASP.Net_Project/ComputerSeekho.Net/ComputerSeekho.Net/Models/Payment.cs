using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ComputerSeekho.Net.Models;

[Table("payments")]
public class Payment
{
    [Key]
    [Column("payment_id")]
    [System.Text.Json.Serialization.JsonPropertyName("paymentId")]
    public int PaymentId { get; set; }

    [Column("amount")]
    [System.Text.Json.Serialization.JsonPropertyName("amount")]
    public double Amount { get; set; }

    [Column("payment_date")]
    [System.Text.Json.Serialization.JsonPropertyName("paymentDate")]
    public DateOnly PaymentDate { get; set; }

    [Column("student_id")]
    [System.Text.Json.Serialization.JsonIgnore]
    public int StudentId { get; set; }

    [ForeignKey("StudentId")]
    [System.Text.Json.Serialization.JsonPropertyName("student")]
    [Microsoft.AspNetCore.Mvc.ModelBinding.Validation.ValidateNever]
    public virtual Student? Student { get; set; }

    [Column("payment_type_id")]
    [System.Text.Json.Serialization.JsonIgnore]
    public int PaymentTypeId { get; set; }

    [ForeignKey("PaymentTypeId")]
    [System.Text.Json.Serialization.JsonPropertyName("paymentTypeId")]
    [Microsoft.AspNetCore.Mvc.ModelBinding.Validation.ValidateNever]
    public virtual PaymentType? PaymentType { get; set; }
}
