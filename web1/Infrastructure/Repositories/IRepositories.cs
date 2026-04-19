using PortfolioAPI.Domain.Entities;

namespace PortfolioAPI.Infrastructure.Repositories;

public interface IUserProfileRepository
{
    Task<UserProfile?> GetAsync();
    Task<UserProfile> UpdateAsync(UserProfile profile);
}

public interface ISkillRepository
{
    Task<IEnumerable<Skill>> GetAllAsync();
    Task<Skill?> GetByIdAsync(int id);
    Task<Skill> CreateAsync(Skill skill);
    Task<Skill> UpdateAsync(Skill skill);
    Task DeleteAsync(int id);
}

public interface IProjectRepository
{
    Task<IEnumerable<Project>> GetAllAsync();
    Task<Project?> GetByIdAsync(int id);
    Task<Project> CreateAsync(Project project);
    Task<Project> UpdateAsync(Project project);
    Task DeleteAsync(int id);
}

public interface IExperienceRepository
{
    Task<IEnumerable<Experience>> GetAllAsync();
    Task<Experience?> GetByIdAsync(int id);
    Task<Experience> CreateAsync(Experience experience);
    Task<Experience> UpdateAsync(Experience experience);
    Task DeleteAsync(int id);
}

public interface IAdminUserRepository
{
    Task<AdminUser?> GetByUsernameAsync(string username);
    Task UpdateLastLoginAsync(int id);
}

public interface IActivityLogRepository
{
    Task LogAsync(string action, string entityName, string entityId, string details, int adminUserId);
    Task<IEnumerable<ActivityLog>> GetAllAsync(int page, int pageSize);
    Task<int> CountAsync();
}

public interface IAnalyticsRepository
{
    Task TrackAsync(string page, int duration, string deviceType, string ip, string userAgent, string referrer);
    Task<IEnumerable<VisitorAnalytics>> GetAllAsync(int page, int pageSize);
    Task<int> CountAsync();
    Task<object> GetSummaryAsync();
}

public interface IFeedbackRepository
{
    Task<Feedback> CreateAsync(Feedback feedback);
    Task<IEnumerable<Feedback>> GetAllAsync();
    Task DeleteAsync(int id);
}
