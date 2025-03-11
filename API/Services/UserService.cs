using System.Text.Json;

public class UserService : IUserService
{
    private readonly IWebHostEnvironment _environment;
    private readonly IIconService _iconService;
    private readonly ILogger<UserService> _logger;

    public UserService(
        IWebHostEnvironment environment,
        IIconService iconService,
        ILogger<UserService> logger)
    {
        _environment = environment;
        _iconService = iconService;
        _logger = logger;
    }

    public async Task<IEnumerable<UserDto>> GetUsersAsync()
    {
        var usersDirectory = Path.Combine(_environment.ContentRootPath, "Data", "Users");
        var userFiles = Directory.GetFiles(usersDirectory, "*.json");
        var users = new List<UserDto>();

        foreach (var file in userFiles)
        {
            try
            {
                var json = await File.ReadAllTextAsync(file);
                var user = JsonSerializer.Deserialize<User>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (user != null)
                {
                    var iconName = string.IsNullOrEmpty(user.IconName) ? "unknown" : user.IconName;

                    users.Add(new UserDto(
                        user.Name,
                        user.Age,
                        user.Registered,
                        user.Email,
                        user.Balance,
                        $"/api/Icons/{iconName}"
                    ));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deserializing user from file {FileName}", file);
            }
        }

        return users;
    }
}