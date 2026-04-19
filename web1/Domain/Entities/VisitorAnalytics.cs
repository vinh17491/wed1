namespace PortfolioAPI.Domain.Entities;

public class VisitorAnalytics
{
    public int Id { get; set; }
    public string Page { get; set; } = string.Empty;
    public DateTime VisitTime { get; set; } = DateTime.UtcNow;
    public int Duration { get; set; } // seconds
    public string DeviceType { get; set; } = string.Empty; // Mobile, Desktop, Tablet
    public string IPAddress { get; set; } = string.Empty;
    public string UserAgent { get; set; } = string.Empty;
    public string Referrer { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
}
