using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using PortfolioAPI.Application.DTOs;
using PortfolioAPI.Domain.Entities;
using PortfolioAPI.Infrastructure.Repositories;

namespace PortfolioAPI.Application.Services;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginDto dto);
}

public class AuthService : IAuthService
{
    private readonly IAdminUserRepository _repo;
    private readonly IConfiguration _config;

    public AuthService(IAdminUserRepository repo, IConfiguration config)
    {
        _repo = repo;
        _config = config;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await _repo.GetByUsernameAsync(dto.Username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return null;

        await _repo.UpdateLastLoginAsync(user.Id);

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddHours(24);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: creds
        );

        return new LoginResponseDto(
            new JwtSecurityTokenHandler().WriteToken(token),
            user.Username,
            user.Role,
            expires
        );
    }
}

public interface IPortfolioService
{
    Task<UserProfileDto?> GetProfileAsync();
    Task<UserProfileDto> UpdateProfileAsync(UpdateUserProfileDto dto, int adminId);
    Task<IEnumerable<SkillDto>> GetSkillsAsync();
    Task<SkillDto> CreateSkillAsync(CreateSkillDto dto, int adminId);
    Task<SkillDto?> UpdateSkillAsync(int id, UpdateSkillDto dto, int adminId);
    Task<bool> DeleteSkillAsync(int id, int adminId);
    Task<IEnumerable<ProjectDto>> GetProjectsAsync();
    Task<ProjectDto> CreateProjectAsync(CreateProjectDto dto, int adminId);
    Task<ProjectDto?> UpdateProjectAsync(int id, UpdateProjectDto dto, int adminId);
    Task<bool> DeleteProjectAsync(int id, int adminId);
    Task<IEnumerable<ExperienceDto>> GetExperiencesAsync();
    Task<ExperienceDto> CreateExperienceAsync(CreateExperienceDto dto, int adminId);
    Task<ExperienceDto?> UpdateExperienceAsync(int id, UpdateExperienceDto dto, int adminId);
    Task<bool> DeleteExperienceAsync(int id, int adminId);
}

public class PortfolioService : IPortfolioService
{
    private readonly IUserProfileRepository _profileRepo;
    private readonly ISkillRepository _skillRepo;
    private readonly IProjectRepository _projectRepo;
    private readonly IExperienceRepository _expRepo;
    private readonly IActivityLogRepository _logRepo;

    public PortfolioService(
        IUserProfileRepository profileRepo,
        ISkillRepository skillRepo,
        IProjectRepository projectRepo,
        IExperienceRepository expRepo,
        IActivityLogRepository logRepo)
    {
        _profileRepo = profileRepo;
        _skillRepo = skillRepo;
        _projectRepo = projectRepo;
        _expRepo = expRepo;
        _logRepo = logRepo;
    }

    public async Task<UserProfileDto?> GetProfileAsync()
    {
        var p = await _profileRepo.GetAsync();
        return p == null ? null : MapProfile(p);
    }

    public async Task<UserProfileDto> UpdateProfileAsync(UpdateUserProfileDto dto, int adminId)
    {
        var profile = await _profileRepo.GetAsync() ?? new Domain.Entities.UserProfile();
        profile.FullName = dto.FullName;
        profile.Title = dto.Title;
        profile.Bio = dto.Bio;
        profile.Email = dto.Email;
        profile.Phone = dto.Phone;
        profile.Location = dto.Location;
        profile.AvatarUrl = dto.AvatarUrl;
        profile.GitHubUrl = dto.GitHubUrl;
        profile.LinkedInUrl = dto.LinkedInUrl;
        profile.WebsiteUrl = dto.WebsiteUrl;
        var result = await _profileRepo.UpdateAsync(profile);
        await _logRepo.LogAsync("UPDATE", "UserProfile", result.Id.ToString(), $"Updated profile: {result.FullName}", adminId);
        return MapProfile(result);
    }

    private static UserProfileDto MapProfile(Domain.Entities.UserProfile p) =>
        new(p.Id, p.FullName, p.Title, p.Bio, p.Email, p.Phone, p.Location, p.AvatarUrl, p.GitHubUrl, p.LinkedInUrl, p.WebsiteUrl, p.UpdatedAt);

    public async Task<IEnumerable<SkillDto>> GetSkillsAsync() =>
        (await _skillRepo.GetAllAsync()).Select(s => new SkillDto(s.Id, s.Name, s.Category, s.ProficiencyLevel, s.IconUrl, s.SortOrder));

    public async Task<SkillDto> CreateSkillAsync(CreateSkillDto dto, int adminId)
    {
        var skill = new Domain.Entities.Skill { Name = dto.Name, Category = dto.Category, ProficiencyLevel = dto.ProficiencyLevel, IconUrl = dto.IconUrl, SortOrder = dto.SortOrder };
        var result = await _skillRepo.CreateAsync(skill);
        await _logRepo.LogAsync("CREATE", "Skill", result.Id.ToString(), $"Created skill: {result.Name}", adminId);
        return new SkillDto(result.Id, result.Name, result.Category, result.ProficiencyLevel, result.IconUrl, result.SortOrder);
    }

    public async Task<SkillDto?> UpdateSkillAsync(int id, UpdateSkillDto dto, int adminId)
    {
        var skill = await _skillRepo.GetByIdAsync(id);
        if (skill == null) return null;
        skill.Name = dto.Name; skill.Category = dto.Category;
        skill.ProficiencyLevel = dto.ProficiencyLevel; skill.IconUrl = dto.IconUrl; skill.SortOrder = dto.SortOrder;
        var result = await _skillRepo.UpdateAsync(skill);
        await _logRepo.LogAsync("UPDATE", "Skill", id.ToString(), $"Updated skill: {result.Name}", adminId);
        return new SkillDto(result.Id, result.Name, result.Category, result.ProficiencyLevel, result.IconUrl, result.SortOrder);
    }

    public async Task<bool> DeleteSkillAsync(int id, int adminId)
    {
        var skill = await _skillRepo.GetByIdAsync(id);
        if (skill == null) return false;
        await _skillRepo.DeleteAsync(id);
        await _logRepo.LogAsync("DELETE", "Skill", id.ToString(), $"Deleted skill: {skill.Name}", adminId);
        return true;
    }

    public async Task<IEnumerable<ProjectDto>> GetProjectsAsync() =>
        (await _projectRepo.GetAllAsync()).Select(MapProject);

    public async Task<ProjectDto> CreateProjectAsync(CreateProjectDto dto, int adminId)
    {
        var project = new Domain.Entities.Project
        {
            Title = dto.Title, Description = dto.Description, TechStack = dto.TechStack,
            ImageUrl = dto.ImageUrl, GitHubUrl = dto.GitHubUrl, LiveUrl = dto.LiveUrl,
            IsFeatured = dto.IsFeatured, SortOrder = dto.SortOrder,
            StartDate = dto.StartDate, EndDate = dto.EndDate
        };
        var result = await _projectRepo.CreateAsync(project);
        await _logRepo.LogAsync("CREATE", "Project", result.Id.ToString(), $"Created project: {result.Title}", adminId);
        return MapProject(result);
    }

    public async Task<ProjectDto?> UpdateProjectAsync(int id, UpdateProjectDto dto, int adminId)
    {
        var project = await _projectRepo.GetByIdAsync(id);
        if (project == null) return null;
        project.Title = dto.Title; project.Description = dto.Description; project.TechStack = dto.TechStack;
        project.ImageUrl = dto.ImageUrl; project.GitHubUrl = dto.GitHubUrl; project.LiveUrl = dto.LiveUrl;
        project.IsFeatured = dto.IsFeatured; project.SortOrder = dto.SortOrder;
        project.StartDate = dto.StartDate; project.EndDate = dto.EndDate;
        var result = await _projectRepo.UpdateAsync(project);
        await _logRepo.LogAsync("UPDATE", "Project", id.ToString(), $"Updated project: {result.Title}", adminId);
        return MapProject(result);
    }

    public async Task<bool> DeleteProjectAsync(int id, int adminId)
    {
        var project = await _projectRepo.GetByIdAsync(id);
        if (project == null) return false;
        await _projectRepo.DeleteAsync(id);
        await _logRepo.LogAsync("DELETE", "Project", id.ToString(), $"Deleted project: {project.Title}", adminId);
        return true;
    }

    private static ProjectDto MapProject(Domain.Entities.Project p) =>
        new(p.Id, p.Title, p.Description, p.TechStack, p.ImageUrl, p.GitHubUrl, p.LiveUrl, p.IsFeatured, p.SortOrder, p.StartDate, p.EndDate, p.UpdatedAt);

    public async Task<IEnumerable<ExperienceDto>> GetExperiencesAsync() =>
        (await _expRepo.GetAllAsync()).Select(MapExp);

    public async Task<ExperienceDto> CreateExperienceAsync(CreateExperienceDto dto, int adminId)
    {
        var exp = new Domain.Entities.Experience
        {
            Company = dto.Company, Position = dto.Position, Description = dto.Description,
            Location = dto.Location, CompanyLogoUrl = dto.CompanyLogoUrl,
            StartDate = dto.StartDate, EndDate = dto.EndDate, IsCurrent = dto.IsCurrent, SortOrder = dto.SortOrder
        };
        var result = await _expRepo.CreateAsync(exp);
        await _logRepo.LogAsync("CREATE", "Experience", result.Id.ToString(), $"Created experience: {result.Position} at {result.Company}", adminId);
        return MapExp(result);
    }

    public async Task<ExperienceDto?> UpdateExperienceAsync(int id, UpdateExperienceDto dto, int adminId)
    {
        var exp = await _expRepo.GetByIdAsync(id);
        if (exp == null) return null;
        exp.Company = dto.Company; exp.Position = dto.Position; exp.Description = dto.Description;
        exp.Location = dto.Location; exp.CompanyLogoUrl = dto.CompanyLogoUrl;
        exp.StartDate = dto.StartDate; exp.EndDate = dto.EndDate; exp.IsCurrent = dto.IsCurrent; exp.SortOrder = dto.SortOrder;
        var result = await _expRepo.UpdateAsync(exp);
        await _logRepo.LogAsync("UPDATE", "Experience", id.ToString(), $"Updated experience at {result.Company}", adminId);
        return MapExp(result);
    }

    public async Task<bool> DeleteExperienceAsync(int id, int adminId)
    {
        var exp = await _expRepo.GetByIdAsync(id);
        if (exp == null) return false;
        await _expRepo.DeleteAsync(id);
        await _logRepo.LogAsync("DELETE", "Experience", id.ToString(), $"Deleted experience at {exp.Company}", adminId);
        return true;
    }

    private static ExperienceDto MapExp(Domain.Entities.Experience e) =>
        new(e.Id, e.Company, e.Position, e.Description, e.Location, e.CompanyLogoUrl, e.StartDate, e.EndDate, e.IsCurrent, e.SortOrder);
}

public interface IFeedbackService
{
    Task<FeedbackDto> CreateAsync(CreateFeedbackDto dto);
    Task<IEnumerable<FeedbackDto>> GetAllAsync();
    Task<bool> DeleteAsync(int id);
}

public class FeedbackService : IFeedbackService
{
    private readonly IFeedbackRepository _repo;

    public FeedbackService(IFeedbackRepository repo)
    {
        _repo = repo;
    }

    public async Task<FeedbackDto> CreateAsync(CreateFeedbackDto dto)
    {
        var feedback = new Feedback
        {
            Name = dto.Name,
            Email = dto.Email,
            Rating = dto.Rating,
            Message = dto.Message
        };
        var result = await _repo.CreateAsync(feedback);
        return MapFeedback(result);
    }

    public async Task<IEnumerable<FeedbackDto>> GetAllAsync() =>
        (await _repo.GetAllAsync()).Select(MapFeedback);

    public async Task<bool> DeleteAsync(int id)
    {
        await _repo.DeleteAsync(id);
        return true;
    }

    private static FeedbackDto MapFeedback(Feedback f) =>
        new(f.Id, f.Name, f.Email, f.Rating, f.Message, f.CreatedAt);
}
