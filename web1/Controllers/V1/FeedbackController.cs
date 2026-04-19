using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PortfolioAPI.Application.DTOs;
using PortfolioAPI.Application.Services;

namespace PortfolioAPI.Controllers.V1;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class FeedbackController : ControllerBase
{
    private readonly IFeedbackService _service;

    public FeedbackController(IFeedbackService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponseDto<FeedbackDto>>> Create(CreateFeedbackDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return Ok(new ApiResponseDto<FeedbackDto>(true, "Feedback submitted successfully", result));
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDto<IEnumerable<FeedbackDto>>>> GetAll()
    {
        var result = await _service.GetAllAsync();
        return Ok(new ApiResponseDto<IEnumerable<FeedbackDto>>(true, "Feedback retrieved successfully", result));
    }

    [HttpDelete("admin/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDto<string>>> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return Ok(new ApiResponseDto<string>(true, "Feedback deleted successfully", null));
    }
}
