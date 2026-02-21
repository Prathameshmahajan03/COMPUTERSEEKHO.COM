using Microsoft.AspNetCore.Mvc;

namespace ComputerSeekho.Net.Controllers;

[Route("i18n")]
[ApiController]
[Microsoft.AspNetCore.Authorization.AllowAnonymous]
[Microsoft.AspNetCore.Cors.EnableCors("AllowReactApp")]
public class I18nController : ControllerBase
{
    // Basic implementation to satisfy frontend. 
    // If Java backend serves properties files, we can mock it or serve a JSON.
    
    [HttpGet("messages")]
    public IActionResult GetMessages([FromQuery] string lang)
    {
        Console.WriteLine($"I18N Request Received for lang: {lang}");
        var messages = new Dictionary<string, string>();

        if (lang == "hi")
        {
            messages["home.welcome"] = "कंप्यूटर सीखो में आपका स्वागत है";
            messages["home.subtitle"] = "बेहतर भविष्य के लिए आपको सर्वोत्तम आईटी कौशल के साथ सशक्त बनाना।";
            messages["home.explore"] = "हमारे पाठ्यक्रमों का अन्वेषण करें और आज ही अपनी यात्रा शुरू करें।";
            messages["home.announcement"] = "नवीनतम घोषणा";
            messages["home.no_announcement"] = "फिलहाल कोई घोषणा नहीं है।";
            messages["home.campus"] = "कैंपस जीवन";
            messages["home.labs"] = "अत्याधुनिक प्रयोगशालाएँ";
            messages["home.community"] = "जीवंत छात्र समुदाय";
        }
        else // Default to English
        {
            messages["home.welcome"] = "Welcome to Computer Seekho";
            messages["home.subtitle"] = "Empowering you with the best IT skills for a brighter future.";
            messages["home.explore"] = "Explore our courses and start your journey today.";
            messages["home.announcement"] = "Latest Announcement";
            messages["home.no_announcement"] = "No announcements at the moment.";
            messages["home.campus"] = "Campus Life";
            messages["home.labs"] = "State of the Art Labs";
            messages["home.community"] = "Vibrant Student Community";
        }

        return Ok(messages);
    }

    [HttpGet("greet")]
    public IActionResult Greet([FromQuery] string lang)
    {
        if (lang == "hi") return Ok("नमस्ते! कंप्यूटर सीखो में आपका स्वागत है।");
        return Ok("Hello! Welcome to Computer Seekho.");
    }
}
