using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Domain.Entities;
using PortfolioAPI.Infrastructure.Data;

namespace PortfolioAPI.Infrastructure.Repositories;

public class UserProfileRepository : IUserProfileRepository
{
    private readonly AppDbContext _ctx;
    public UserProfileRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<UserProfile?> GetAsync() =>
        await _ctx.UserProfiles.FirstOrDefaultAsync();

    public async Task<UserProfile> UpdateAsync(UserProfile profile)
    {
        profile.UpdatedAt = DateTime.UtcNow;
        _ctx.UserProfiles.Update(profile);
        await _ctx.SaveChangesAsync();
        return profile;
    }
}

public class SkillRepository : ISkillRepository
{
    private readonly AppDbContext _ctx;
    public SkillRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<IEnumerable<Skill>> GetAllAsync() =>
        await _ctx.Skills.OrderBy(s => s.SortOrder).ToListAsync();

    public async Task<Skill?> GetByIdAsync(int id) =>
        await _ctx.Skills.FindAsync(id);

    public async Task<Skill> CreateAsync(Skill skill)
    {
        _ctx.Skills.Add(skill);
        await _ctx.SaveChangesAsync();
        return skill;
    }

    public async Task<Skill> UpdateAsync(Skill skill)
    {
        _ctx.Skills.Update(skill);
        await _ctx.SaveChangesAsync();
        return skill;
    }

    public async Task DeleteAsync(int id)
    {
        var skill = await _ctx.Skills.FindAsync(id);
        if (skill != null) { _ctx.Skills.Remove(skill); await _ctx.SaveChangesAsync(); }
    }
}

public class ProjectRepository : IProjectRepository
{
    private readonly AppDbContext _ctx;
    public ProjectRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<IEnumerable<Project>> GetAllAsync() =>
        await _ctx.Projects.OrderBy(p => p.SortOrder).ToListAsync();

    public async Task<Project?> GetByIdAsync(int id) =>
        await _ctx.Projects.FindAsync(id);

    public async Task<Project> CreateAsync(Project project)
    {
        _ctx.Projects.Add(project);
        await _ctx.SaveChangesAsync();
        return project;
    }

    public async Task<Project> UpdateAsync(Project project)
    {
        project.UpdatedAt = DateTime.UtcNow;
        _ctx.Projects.Update(project);
        await _ctx.SaveChangesAsync();
        return project;
    }

    public async Task DeleteAsync(int id)
    {
        var project = await _ctx.Projects.FindAsync(id);
        if (project != null) { _ctx.Projects.Remove(project); await _ctx.SaveChangesAsync(); }
    }
}

public class ExperienceRepository : IExperienceRepository
{
    private readonly AppDbContext _ctx;
    public ExperienceRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<IEnumerable<Experience>> GetAllAsync() =>
        await _ctx.Experiences.OrderBy(e => e.SortOrder).ToListAsync();

    public async Task<Experience?> GetByIdAsync(int id) =>
        await _ctx.Experiences.FindAsync(id);

    public async Task<Experience> CreateAsync(Experience exp)
    {
        _ctx.Experiences.Add(exp);
        await _ctx.SaveChangesAsync();
        return exp;
    }

    public async Task<Experience> UpdateAsync(Experience exp)
    {
        _ctx.Experiences.Update(exp);
        await _ctx.SaveChangesAsync();
        return exp;
    }

    public async Task DeleteAsync(int id)
    {
        var exp = await _ctx.Experiences.FindAsync(id);
        if (exp != null) { _ctx.Experiences.Remove(exp); await _ctx.SaveChangesAsync(); }
    }
}

public class AdminUserRepository : IAdminUserRepository
{
    private readonly AppDbContext _ctx;
    public AdminUserRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<AdminUser?> GetByUsernameAsync(string username) =>
        await _ctx.AdminUsers.FirstOrDefaultAsync(u => u.Username == username);

    public async Task<AdminUser?> GetByIdAsync(int id) =>
        await _ctx.AdminUsers.FindAsync(id);

    public async Task<AdminUser> CreateAsync(AdminUser user)
    {
        _ctx.AdminUsers.Add(user);
        await _ctx.SaveChangesAsync();
        return user;
    }

    public async Task UpdateLastLoginAsync(int id)
    {
        var user = await _ctx.AdminUsers.FindAsync(id);
        if (user != null) { user.LastLoginAt = DateTime.UtcNow; await _ctx.SaveChangesAsync(); }
    }
}

public class ActivityLogRepository : IActivityLogRepository
{
    private readonly AppDbContext _ctx;
    public ActivityLogRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task LogAsync(string action, string entityName, string entityId, string details, int adminUserId)
    {
        _ctx.ActivityLogs.Add(new ActivityLog
        {
            Action = action,
            EntityName = entityName,
            EntityId = entityId,
            Details = details,
            AdminUserId = adminUserId,
            Timestamp = DateTime.UtcNow
        });
        await _ctx.SaveChangesAsync();
    }

    public async Task<IEnumerable<ActivityLog>> GetAllAsync(int page, int pageSize) =>
        await _ctx.ActivityLogs
            .Include(a => a.AdminUser)
            .OrderByDescending(a => a.Timestamp)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

    public async Task<int> CountAsync() => await _ctx.ActivityLogs.CountAsync();
}

public class AnalyticsRepository : IAnalyticsRepository
{
    private readonly AppDbContext _ctx;
    public AnalyticsRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task TrackAsync(string page, int duration, string deviceType, string ip, string userAgent, string referrer)
    {
        _ctx.VisitorAnalytics.Add(new VisitorAnalytics
        {
            Page = page,
            Duration = duration,
            DeviceType = deviceType,
            IPAddress = ip,
            UserAgent = userAgent,
            Referrer = referrer,
            VisitTime = DateTime.UtcNow
        });
        await _ctx.SaveChangesAsync();
    }

    public async Task<IEnumerable<VisitorAnalytics>> GetAllAsync(int page, int pageSize) =>
        await _ctx.VisitorAnalytics
            .OrderByDescending(v => v.VisitTime)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

    public async Task<int> CountAsync() => await _ctx.VisitorAnalytics.CountAsync();

    public async Task<object> GetSummaryAsync()
    {
        var all = await _ctx.VisitorAnalytics.ToListAsync();
        var today = DateTime.UtcNow.Date;
        var dailyVisits = all
            .GroupBy(v => v.VisitTime.Date)
            .OrderBy(g => g.Key)
            .TakeLast(30)
            .Select(g => new { Date = g.Key.ToString("yyyy-MM-dd"), Count = g.Count() })
            .ToList();

        return new
        {
            TotalVisits = all.Count,
            TodayVisits = all.Count(v => v.VisitTime.Date == today),
            UniqueIPs = all.Select(v => v.IPAddress).Distinct().Count(),
            VisitsByPage = all.GroupBy(v => v.Page).ToDictionary(g => g.Key, g => g.Count()),
            VisitsByDevice = all.GroupBy(v => v.DeviceType).ToDictionary(g => g.Key, g => g.Count()),
            DailyVisits = dailyVisits
        };
    }
}

public class FeedbackRepository : IFeedbackRepository
{
    private readonly AppDbContext _ctx;
    public FeedbackRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<Feedback> CreateAsync(Feedback feedback)
    {
        _ctx.Feedbacks.Add(feedback);
        await _ctx.SaveChangesAsync();
        return feedback;
    }

    public async Task<IEnumerable<Feedback>> GetAllAsync(int? rating = null, string? category = null, string? username = null)
    {
        var query = _ctx.Feedbacks.AsQueryable();

        if (rating.HasValue) query = query.Where(f => f.Rating == rating.Value);
        if (!string.IsNullOrEmpty(category)) query = query.Where(f => f.Category == category);
        if (!string.IsNullOrEmpty(username)) query = query.Where(f => f.Name.Contains(username));

        return await query.OrderByDescending(f => f.CreatedAt).ToListAsync();
    }

    public async Task<Feedback?> GetByIdAsync(int id) =>
        await _ctx.Feedbacks.FindAsync(id);

    public async Task<Feedback> UpdateAsync(Feedback feedback)
    {
        _ctx.Feedbacks.Update(feedback);
        await _ctx.SaveChangesAsync();
        return feedback;
    }

    public async Task DeleteAsync(int id)
    {
        var feedback = await _ctx.Feedbacks.FindAsync(id);
        if (feedback != null) { _ctx.Feedbacks.Remove(feedback); await _ctx.SaveChangesAsync(); }
    }

    public async Task<int> GetUserFeedbackCountInLast24HoursAsync(int userId)
    {
        var yesterday = DateTime.UtcNow.AddDays(-1);
        return await _ctx.Feedbacks.CountAsync(f => f.UserId == userId && f.CreatedAt > yesterday);
    }
}
