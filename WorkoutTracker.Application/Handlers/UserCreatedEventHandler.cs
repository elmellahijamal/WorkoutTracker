using MediatR;
using Microsoft.Extensions.Logging;
using WorkoutTracker.Domain.Events;

namespace WorkoutTracker.Application.Handlers
{
    public class UserCreatedEventHandler : INotificationHandler<UserCreatedEvent>
    {
        private readonly ILogger<UserCreatedEventHandler> _logger;

        public UserCreatedEventHandler(ILogger<UserCreatedEventHandler> logger)
        {
            _logger = logger;
        }

        public Task Handle(UserCreatedEvent notification, CancellationToken cancellationToken)
        {
            _logger.LogInformation("New user created! Welcome {UserName} (ID: {UserId}, Email: {Email}) at {CreatedAt}",
                notification.UserName,
                notification.UserId,
                notification.Email,
                notification.CreatedAt);

            // Could add: Send welcome email, create default workouts, setup preferences
            return Task.CompletedTask;
        }
    }
}