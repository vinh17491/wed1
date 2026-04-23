using System.Security.Claims;
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
    [Authorize]
    public async Task<ActionResult<ApiResponseDto<FeedbackDto>>> Create(CreateFeedbackDto dto)
    {
        try
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            
            var userId = int.Parse(userIdStr);
            var result = await _service.CreateAsync(dto, userId);
            return Ok(new ApiResponseDto<FeedbackDto>(true, "Feedback submitted successfully", result));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponseDto<FeedbackDto>(false, ex.Message, null));
        }
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDto<IEnumerable<FeedbackDto>>>> GetAll(
        [FromQuery] int? rating, 
        [FromQuery] string? category, 
        [FromQuery] string? username)
    {
        var result = await _service.GetAllAsync(rating, category, username);
        return Ok(new ApiResponseDto<IEnumerable<FeedbackDto>>(true, "Feedback retrieved successfully", result));
    }

    [HttpPatch("admin/{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDto<bool>>> UpdateStatus(int id, [FromBody] string status)
    {
        var result = await _service.UpdateStatusAsync(id, status);
        if (!result) return NotFound();
        return Ok(new ApiResponseDto<bool>(true, "Status updated successfully", true));
    }

    [HttpDelete("admin/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDto<string>>> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return Ok(new ApiResponseDto<string>(true, "Feedback deleted successfully", null));
    }
}
