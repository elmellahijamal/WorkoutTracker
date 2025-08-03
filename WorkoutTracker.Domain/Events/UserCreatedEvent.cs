using MediatR;

namespace WorkoutTracker.Domain.Events
{
    public class UserCreatedEvent : INotification
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public DateTime CreatedAt { get; set; }

        public UserCreatedEvent(int userId, string userName, string email)
        {
            UserId = userId;
            UserName = userName;
            Email = email;
            CreatedAt = DateTime.UtcNow;
        }
    }
}