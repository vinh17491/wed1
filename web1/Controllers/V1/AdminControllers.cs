using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PortfolioAPI.Application.DTOs;
using PortfolioAPI.Application.Services;
using PortfolioAPI.Infrastructure.Repositories;
using System.Text;
using System.Text.Json;

namespace PortfolioAPI.Controllers.V1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    public AuthController(IAuthService authService) => _authService = authService;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto);
        return result == null
            ? Unauthorized(new ApiResponseDto<object>(false, "Invalid credentials", null))
            : Ok(new ApiResponseDto<LoginResponseDto>(true, "Login successful", result));
    }
}

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/chat")]
public class ChatController : ControllerBase
{
    private readonly IChatService _chatService;
    public ChatController(IChatService chatService) => _chatService = chatService;

    [HttpPost]
    public async Task<IActionResult> Chat([FromBody] ChatRequestDto dto)
    {
        var result = await _chatService.ChatAsync(dto);
        return Ok(new ApiResponseDto<ChatResponseDto>(true, "OK", result));
    }
}

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/analytics")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsRepository _repo;
    public AnalyticsController(IAnalyticsRepository repo) => _repo = repo;

    [HttpPost("track")]
    public async Task<IActionResult> Track([FromBody] TrackVisitDto dto)
    {
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        var ua = Request.Headers.UserAgent.ToString();
        var referrer = Request.Headers.Referer.ToString();
        await _repo.TrackAsync(dto.Page, dto.Duration, dto.DeviceType, ip, ua, referrer);
        return Ok(new ApiResponseDto<object>(true, "Tracked", null));
    }

    [HttpGet("summary")]
    [Authorize]
    public async Task<IActionResult> Summary()
    {
        var result = await _repo.GetSummaryAsync();
        return Ok(new ApiResponseDto<object>(true, "OK", result));
    }

    [HttpGet("logs")]
    [Authorize]
    public async Task<IActionResult> Logs([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var data = await _repo.GetAllAsync(page, pageSize);
        var total = await _repo.CountAsync();
        return Ok(new PagedResponseDto<VisitorAnalyticsDto>(
            true, "OK",
            data.Select(v => new VisitorAnalyticsDto(v.Id, v.Page, v.VisitTime, v.Duration, v.DeviceType, v.IPAddress)),
            total, page, pageSize
        ));
    }
}

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/admin")]
[Authorize]
public class AdminController : ControllerBase
{
    private readonly IActivityLogRepository _logRepo;
    private readonly IConfiguration _config;

    public AdminController(IActivityLogRepository logRepo, IConfiguration config)
    {
        _logRepo = logRepo;
        _config = config;
    }

    [HttpGet("logs")]
    public async Task<IActionResult> GetLogs([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var data = await _logRepo.GetAllAsync(page, pageSize);
        var total = await _logRepo.CountAsync();
        return Ok(new PagedResponseDto<ActivityLogDto>(
            true, "OK",
            data.Select(l => new ActivityLogDto(l.Id, l.Action, l.EntityName, l.EntityId, l.Details, l.Timestamp, l.AdminUser.Username)),
            total, page, pageSize
        ));
    }

    [HttpPost("backup")]
    public IActionResult Backup()
    {
        var backupDir = Path.Combine(Directory.GetCurrentDirectory(), "Backups");
        Directory.CreateDirectory(backupDir);
        var fileName = $"backup_{DateTime.UtcNow:yyyyMMdd_HHmmss}.json";
        var filePath = Path.Combine(backupDir, fileName);
        var info = new { BackedUpAt = DateTime.UtcNow, Server = _config.GetConnectionString("DefaultConnection") };
        System.IO.File.WriteAllText(filePath, JsonSerializer.Serialize(info, new JsonSerializerOptions { WriteIndented = true }));
        return Ok(new ApiResponseDto<object>(true, $"Backup created: {fileName}", new { FileName = fileName, Path = filePath }));
    }
}
