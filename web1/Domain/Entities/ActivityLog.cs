namespace PortfolioAPI.Domain.Entities;

public class ActivityLog
{
    public int Id { get; set; }
    public string Action { get; set; } = string.Empty; // CREATE, UPDATE, DELETE
    public string EntityName { get; set; } = string.Empty;
    public string EntityId { get; set; } = string.Empty;
    public string Details { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public int AdminUserId { get; set; }
    public AdminUser AdminUser { get; set; } = null!;
}
