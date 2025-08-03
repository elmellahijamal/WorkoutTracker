using MediatR;
using Microsoft.Extensions.Logging;
using WorkoutTracker.Domain.Events;

namespace WorkoutTracker.Application.Handlers
{
    public class WorkoutStartedEventHandler : INotificationHandler<WorkoutStartedEvent>
    {
        private readonly ILogger<WorkoutStartedEventHandler> _logger;

        public WorkoutStartedEventHandler(ILogger<WorkoutStartedEventHandler> logger)
        {
            _logger = logger;
        }

        public Task Handle(WorkoutStartedEvent notification, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Workout started! User {UserId} began workout '{WorkoutName}' (ID: {WorkoutId}) at {StartedAt}",
                notification.UserId,
                notification.WorkoutName,
                notification.WorkoutId,
                notification.StartedAt);

            // Could add: Start timer, send motivation, track session
            return Task.CompletedTask;
        }
    }
}