public class IconService : IIconService
{
    private readonly IWebHostEnvironment _environment;

    public IconService(IWebHostEnvironment environment)
    {
        _environment = environment ?? throw new ArgumentNullException(nameof(environment));
    }

    public async Task<byte[]?> GetIconBytesAsync(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Icon name cannot be null or empty.", nameof(name));
        }

        var iconPath = Path.Combine(_environment.ContentRootPath, "Data", "Icons", $"{name}.png");

        if (!File.Exists(iconPath))
        {
            return null;
        }

        try
        {
            return await File.ReadAllBytesAsync(iconPath);
        }
        catch (UnauthorizedAccessException ex)
        {
            throw new InvalidOperationException($"Access to the file '{iconPath}' is denied.", ex);
        }
        catch (IOException ex)
        {
            throw new InvalidOperationException($"An I/O error occurred while accessing the file '{iconPath}'.", ex);
        }
        catch (Exception ex)
        {
            throw new Exception($"An error occurred while reading the icon '{name}'.", ex);
        }
    }
}