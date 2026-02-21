using MailKit.Net.Smtp;
using MimeKit;
using ComputerSeekho.Net.IServices;

namespace ComputerSeekho.Net.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendEmailAsync(string to, string subject, string body, byte[]? attachment = null, string? attachmentName = null)
    {
        if (string.IsNullOrWhiteSpace(to))
        {
            Console.WriteLine("Email sending skipped: Recipient email is empty.");
            return;
        }

        var email = new MimeMessage();
        email.From.Add(new MailboxAddress("Computer Seekho", _config["Email:Username"]));
        email.To.Add(new MailboxAddress("", to));
        email.Subject = subject;

        var builder = new BodyBuilder { TextBody = body };
        
        if (attachment != null && attachmentName != null)
        {
            builder.Attachments.Add(attachmentName, attachment);
        }

        email.Body = builder.ToMessageBody();

        using var smtp = new SmtpClient();
        try 
        {
            await smtp.ConnectAsync(_config["Email:Host"], int.Parse(_config["Email:Port"] ?? "587"), MailKit.Security.SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(_config["Email:Username"], _config["Email:Password"]);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending email: {ex.Message}");
            // Throwing here would let the caller know, but typically we log and continue if it's a notification
            // However, debugging requires visibility.
            Console.WriteLine(ex.StackTrace);
        }
    }
}
