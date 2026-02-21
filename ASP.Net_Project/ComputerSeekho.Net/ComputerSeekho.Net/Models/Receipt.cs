using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ComputerSeekho.Net.Models;

[Table("receipt")]
public class Receipt
{
    [Key]
    [Column("receipt_id")]
    public int ReceiptId { get; set; }

    [Column("receipt_date")]
    public DateOnly ReceiptDate { get; set; }

    [Column("receipt_amount")]
    public double ReceiptAmount { get; set; }

    [Column("payment_id")]
    public int PaymentId { get; set; }

    [ForeignKey("PaymentId")]
    public virtual Payment? Payment { get; set; }
}
