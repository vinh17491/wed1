using System;

namespace PortfolioAPI.Domain.Entities;

public class Feedback
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int Rating { get; set; } // 1-5
    public string Category { get; set; } = "Other"; // Bug, UI, Speed, Feature, Other
    public string Message { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending"; // Pending, Processed
    public int? UserId { get; set; }
    public AdminUser? User { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
