using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using PortfolioAPI.Application.DTOs;
using PortfolioAPI.Infrastructure.Repositories;

namespace PortfolioAPI.Application.Services;

public interface IChatService
{
    Task<ChatResponseDto> ChatAsync(ChatRequestDto dto);
}

public class ChatService : IChatService
{
    private readonly IConfiguration _config;
    private readonly IHttpClientFactory _httpFactory;
    private readonly IUserProfileRepository _profileRepo;
    private readonly ISkillRepository _skillRepo;
    private readonly IProjectRepository _projectRepo;
    private readonly IExperienceRepository _expRepo;

    public ChatService(
        IConfiguration config, IHttpClientFactory httpFactory,
        IUserProfileRepository profileRepo, ISkillRepository skillRepo,
        IProjectRepository projectRepo, IExperienceRepository expRepo)
    {
        _config = config; _httpFactory = httpFactory;
        _profileRepo = profileRepo; _skillRepo = skillRepo;
        _projectRepo = projectRepo; _expRepo = expRepo;
    }

    public async Task<ChatResponseDto> ChatAsync(ChatRequestDto dto)
    {
        var profile = await _profileRepo.GetAsync();
        var skills = await _skillRepo.GetAllAsync();
        var projects = await _projectRepo.GetAllAsync();
        var experiences = await _expRepo.GetAllAsync();

        var skillsList = string.Join(", ", skills.Select(s => $"{s.Name} ({s.ProficiencyLevel}%)"));
        var projectsList = string.Join("; ", projects.Select(p => $"{p.Title}: {p.Description}"));
        var expList = string.Join("; ", experiences.Select(e => $"{e.Position} at {e.Company}"));

        var systemPrompt = dto.Language == "vi"
            ? $"Bạn là trợ lý AI đại diện cho {profile?.FullName ?? "chủ portfolio"}. Giới thiệu: {profile?.Bio}. Kỹ năng: {skillsList}. Dự án: {projectsList}. Kinh nghiệm: {expList}. Hãy trả lời dựa trên thông tin này bằng tiếng Việt."
            : $"You are an AI assistant representing {profile?.FullName ?? "the portfolio owner"}. Bio: {profile?.Bio}. Skills: {skillsList}. Projects: {projectsList}. Experience: {expList}. Answer questions about this person based on the information provided.";

        var apiKey = _config["OpenAI:ApiKey"];
        if (string.IsNullOrEmpty(apiKey) || apiKey == "your-openai-api-key-here")
        {
            // Fallback response when no API key configured
            var fallback = dto.Language == "vi"
                ? $"Xin chào! Tôi là {profile?.FullName}. Tôi có kỹ năng: {skillsList}. Hỏi tôi bất cứ điều gì về portfolio của tôi!"
                : $"Hi! I'm {profile?.FullName}. I have skills in: {skillsList}. Ask me anything about my portfolio!";
            return new ChatResponseDto(fallback, DateTime.UtcNow);
        }

        try
        {
            var client = _httpFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            var body = new
            {
                model = "gpt-3.5-turbo",
                messages = new[]
                {
                    new { role = "system", content = systemPrompt },
                    new { role = "user", content = dto.Message }
                },
                max_tokens = 500,
                temperature = 0.7
            };

            var response = await client.PostAsync(
                "https://api.openai.com/v1/chat/completions",
                new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json")
            );

            var responseJson = await response.Content.ReadAsStringAsync();
            var doc = JsonDocument.Parse(responseJson);
            var message = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString() ?? "I couldn't process your request.";

            return new ChatResponseDto(message, DateTime.UtcNow);
        }
        catch (Exception ex)
        {
            return new ChatResponseDto($"AI service error: {ex.Message}", DateTime.UtcNow);
        }
    }
}
