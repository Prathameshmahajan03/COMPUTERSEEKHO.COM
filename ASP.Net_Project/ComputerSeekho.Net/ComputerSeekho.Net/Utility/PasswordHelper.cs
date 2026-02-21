using BCrypt.Net;

namespace ComputerSeekho.Net.Utility;

public static class PasswordHelper
{
    public static bool VerifyPassword(string inputPassword, string storedHash)
    {
        try
        {
            return BCrypt.Net.BCrypt.Verify(inputPassword, storedHash);
        }
        catch
        {
            return false;
        }
    }

    public static string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }
}
