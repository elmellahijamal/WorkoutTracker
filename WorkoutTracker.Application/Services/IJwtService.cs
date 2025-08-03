using WorkoutTracker.Domain.Entities;

namespace WorkoutTracker.Application.Services
{
    public interface IJwtService
    {
        string GenerateToken(User user);
        int? GetUserIdFromToken(string token);
    }
}