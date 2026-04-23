namespace PortfolioAPI.Application.DTOs;

public record UserProfileDto(
    int Id,
    string FullName,
    string Title,
    string Bio,
    string Email,
    string Phone,
    string Location,
    string AvatarUrl,
    string GitHubUrl,
    string LinkedInUrl,
    string WebsiteUrl,
    DateTime UpdatedAt
);

public record UpdateUserProfileDto(
    string FullName,
    string Title,
    string Bio,
    string Email,
    string Phone,
    string Location,
    string AvatarUrl,
    string GitHubUrl,
    string LinkedInUrl,
    string WebsiteUrl
);

public record SkillDto(int Id, string Name, string Category, int ProficiencyLevel, string IconUrl, int SortOrder);
public record CreateSkillDto(string Name, string Category, int ProficiencyLevel, string IconUrl, int SortOrder);
public record UpdateSkillDto(string Name, string Category, int ProficiencyLevel, string IconUrl, int SortOrder);

public record ProjectDto(
    int Id, string Title, string Description, string TechStack,
    string ImageUrl, string GitHubUrl, string LiveUrl,
    bool IsFeatured, int SortOrder, DateTime StartDate, DateTime? EndDate, DateTime UpdatedAt
);
public record CreateProjectDto(
    string Title, string Description, string TechStack,
    string ImageUrl, string GitHubUrl, string LiveUrl,
    bool IsFeatured, int SortOrder, DateTime StartDate, DateTime? EndDate
);
public record UpdateProjectDto(
    string Title, string Description, string TechStack,
    string ImageUrl, string GitHubUrl, string LiveUrl,
    bool IsFeatured, int SortOrder, DateTime StartDate, DateTime? EndDate
);

public record ExperienceDto(
    int Id, string Company, string Position, string Description,
    string Location, string CompanyLogoUrl,
    DateTime StartDate, DateTime? EndDate, bool IsCurrent, int SortOrder
);
public record CreateExperienceDto(
    string Company, string Position, string Description,
    string Location, string CompanyLogoUrl,
    DateTime StartDate, DateTime? EndDate, bool IsCurrent, int SortOrder
);
public record UpdateExperienceDto(
    string Company, string Position, string Description,
    string Location, string CompanyLogoUrl,
    DateTime StartDate, DateTime? EndDate, bool IsCurrent, int SortOrder
);

public record ActivityLogDto(int Id, string Action, string EntityName, string EntityId, string Details, DateTime Timestamp, string AdminUsername);
public record VisitorAnalyticsDto(int Id, string Page, DateTime VisitTime, int Duration, string DeviceType, string IPAddress);

public record TrackVisitDto(string Page, int Duration, string DeviceType);

public record LoginDto(string Username, string Password);
public record RegisterDto(string Username, string Email, string Password);
public record LoginResponseDto(string Token, string Username, string Role, DateTime Expires);

public record ChatRequestDto(string Message, string Language = "en");
public record ChatResponseDto(string Message, DateTime Timestamp);

public record ApiResponseDto<T>(bool Success, string Message, T? Data);
public record PagedResponseDto<T>(bool Success, string Message, IEnumerable<T> Data, int Total, int Page, int PageSize);

public record AnalyticsSummaryDto(
    int TotalVisits,
    int TodayVisits,
    int UniqueIPs,
    Dictionary<string, int> VisitsByPage,
    Dictionary<string, int> VisitsByDevice,
    List<DailyVisitDto> DailyVisits
);
public record DailyVisitDto(string Date, int Count);

public record FeedbackDto(int Id, string Name, string Email, int Rating, string Category, string Message, string Status, DateTime CreatedAt);
public record CreateFeedbackDto(int Rating, string Category, string Message);
