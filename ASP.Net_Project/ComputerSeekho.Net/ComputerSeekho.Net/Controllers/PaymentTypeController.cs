using Microsoft.AspNetCore.Mvc;
using ComputerSeekho.Net.Models;
using ComputerSeekho.Net.IServices;

namespace ComputerSeekho.Net.Controllers;

[Route("paymentTypes")]
[ApiController]
public class PaymentTypeController : ControllerBase
{
    private readonly IPaymentTypeService _service;
    public PaymentTypeController(IPaymentTypeService service) { _service = service; }

    [HttpGet("getAll")]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpPost("add")]
    public async Task<IActionResult> Add([FromBody] PaymentType item) => Ok(await _service.AddAsync(item));
}
