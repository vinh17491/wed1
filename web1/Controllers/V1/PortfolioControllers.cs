using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PortfolioAPI.Application.DTOs;
using PortfolioAPI.Application.Services;

namespace PortfolioAPI.Controllers.V1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class ProfileController : ControllerBase
{
    private readonly IPortfolioService _service;
    public ProfileController(IPortfolioService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var result = await _service.GetProfileAsync();
        return result == null ? NotFound() : Ok(new ApiResponseDto<UserProfileDto>(true, "OK", result));
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> Update([FromBody] UpdateUserProfileDto dto)
    {
        var adminId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var result = await _service.UpdateProfileAsync(dto, adminId);
        return Ok(new ApiResponseDto<UserProfileDto>(true, "Updated", result));
    }
}

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class SkillsController : ControllerBase
{
    private readonly IPortfolioService _service;
    public SkillsController(IPortfolioService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetSkillsAsync();
        return Ok(new ApiResponseDto<IEnumerable<SkillDto>>(true, "OK", result));
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateSkillDto dto)
    {
        var adminId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var result = await _service.CreateSkillAsync(dto, adminId);
        return CreatedAtAction(nameof(GetAll), new ApiResponseDto<SkillDto>(true, "Created", result));
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateSkillDto dto)
    {
        var adminId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var result = await _service.UpdateSkillAsync(id, dto, adminId);
        return result == null ? NotFound() : Ok(new ApiResponseDto<SkillDto>(true, "Updated", result));
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var adminId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var ok = await _service.DeleteSkillAsync(id, adminId);
        return ok ? Ok(new ApiResponseDto<object>(true, "Deleted", null)) : NotFound();
    }
}

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly IPortfolioService _service;
    public ProjectsController(IPortfolioService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetProjectsAsync();
        return Ok(new ApiResponseDto<IEnumerable<ProjectDto>>(true, "OK", result));
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateProjectDto dto)
    {
        var adminId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var result = await _service.CreateProjectAsync(dto, adminId);
        return CreatedAtAction(nameof(GetAll), new ApiResponseDto<ProjectDto>(true, "Created", result));
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateProjectDto dto)
    {
        var adminId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var result = await _service.UpdateProjectAsync(id, dto, adminId);
        return result == null ? NotFound() : Ok(new ApiResponseDto<ProjectDto>(true, "Updated", result));
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var adminId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var ok = await _service.DeleteProjectAsync(id, adminId);
        return ok ? Ok(new ApiResponseDto<object>(true, "Deleted", null)) : NotFound();
    }
}

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class ExperienceController : ControllerBase
{
    private readonly IPortfolioService _service;
    public ExperienceController(IPortfolioService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetExperiencesAsync();
        return Ok(new ApiResponseDto<IEnumerable<ExperienceDto>>(true, "OK", result));
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateExperienceDto dto)
    {
        var adminId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var result = await _service.CreateExperienceAsync(dto, adminId);
        return CreatedAtAction(nameof(GetAll), new ApiResponseDto<ExperienceDto>(true, "Created", result));
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateExperienceDto dto)
    {
        var adminId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var result = await _service.UpdateExperienceAsync(id, dto, adminId);
        return result == null ? NotFound() : Ok(new ApiResponseDto<ExperienceDto>(true, "Updated", result));
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var adminId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var ok = await _service.DeleteExperienceAsync(id, adminId);
        return ok ? Ok(new ApiResponseDto<object>(true, "Deleted", null)) : NotFound();
    }
}
