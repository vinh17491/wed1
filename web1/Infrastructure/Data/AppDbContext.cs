using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Domain.Entities;

namespace PortfolioAPI.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<UserProfile> UserProfiles => Set<UserProfile>();
    public DbSet<Skill> Skills => Set<Skill>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<Experience> Experiences => Set<Experience>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<ActivityLog> ActivityLogs => Set<ActivityLog>();
    public DbSet<VisitorAnalytics> VisitorAnalytics => Set<VisitorAnalytics>();
    public DbSet<Feedback> Feedbacks => Set<Feedback>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ActivityLog>()
            .HasOne(a => a.AdminUser)
            .WithMany(u => u.ActivityLogs)
            .HasForeignKey(a => a.AdminUserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Seed default admin
        modelBuilder.Entity<AdminUser>().HasData(new AdminUser
        {
            Id = 1,
            Username = "admin",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Email = "admin@portfolio.com",
            Role = "Admin",
            CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            LastLoginAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        });

        // Seed default profile
        modelBuilder.Entity<UserProfile>().HasData(new UserProfile
        {
            Id = 1,
            FullName = "Quách Gia Vinh",
            Title = "Senior Developer & AI Engineer",
            Bio = "Thích xây dựng sản phẩm từ con số 0 đến khi hoàn thiện. Tập trung vào việc biến ý tưởng thành hệ thống thực tế, tối ưu và có thể phát triển lâu dài.",
            Email = "vinhvachocon@gmail.com",
            Phone = "0936059747",
            Location = "Quận 1, TP. Hồ Chí Minh",
            AvatarUrl = "/api/placeholder/400/400",
            GitHubUrl = "https://github.com/vinh17491",
            LinkedInUrl = "",
            WebsiteUrl = "https://vinh.dev",
            CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        });

        // Seed skills
        modelBuilder.Entity<Skill>().HasData(
            new Skill { Id = 1, Name = "React", Category = "Frontend", ProficiencyLevel = 90, SortOrder = 1, CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Skill { Id = 2, Name = "ASP.NET Core", Category = "Backend", ProficiencyLevel = 85, SortOrder = 2, CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Skill { Id = 3, Name = "TypeScript", Category = "Frontend", ProficiencyLevel = 80, SortOrder = 3, CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Skill { Id = 4, Name = "SQL Server", Category = "Database", ProficiencyLevel = 80, SortOrder = 4, CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Skill { Id = 5, Name = "Docker", Category = "DevOps", ProficiencyLevel = 70, SortOrder = 5, CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Skill { Id = 6, Name = "Git", Category = "DevOps", ProficiencyLevel = 90, SortOrder = 6, CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) }
        );

        // Seed projects
        modelBuilder.Entity<Project>().HasData(
            new Project
            {
                Id = 1,
                Title = "Portfolio System",
                Description = "A full-stack portfolio system with admin dashboard, AI chatbot, and analytics.",
                TechStack = "React,ASP.NET Core,.NET 8,SQL Server,OpenAI",
                ImageUrl = "/api/placeholder/800/450",
                GitHubUrl = "https://github.com/vinh17491/portfolio",
                LiveUrl = "https://vinh.dev",
                IsFeatured = true,
                SortOrder = 1,
                StartDate = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                EndDate = null,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );

        // Seed experience
        modelBuilder.Entity<Experience>().HasData(
            new Experience
            {
                Id = 1,
                Company = "Tech Startup",
                Position = "Senior Developer & AI Lead",
                Description = "Leading the development of scalable web applications and AI integrated systems.",
                Location = "Ho Chi Minh City",
                StartDate = new DateTime(2022, 6, 1, 0, 0, 0, DateTimeKind.Utc),
                IsCurrent = true,
                SortOrder = 1,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}
