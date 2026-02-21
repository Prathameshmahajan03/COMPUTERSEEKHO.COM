using Microsoft.AspNetCore.Mvc;
using ComputerSeekho.Net.Models;
using ComputerSeekho.Net.IServices;

namespace ComputerSeekho.Net.Controllers;

[Route("payment")]
[ApiController]
[Microsoft.AspNetCore.Authorization.AllowAnonymous]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddPayment([FromBody] Payment payment)
    {
        var receipt = await _paymentService.ProcessPaymentAsync(payment);
        return Ok(receipt);
    }

    [HttpGet("getAll")]
    public async Task<IActionResult> GetAllPayments()
    {
        return Ok(await _paymentService.GetAllPaymentsAsync());
    }
}
