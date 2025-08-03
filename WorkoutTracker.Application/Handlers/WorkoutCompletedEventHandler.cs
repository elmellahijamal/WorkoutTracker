using MediatR;
using Microsoft.Extensions.Logging;
using WorkoutTracker.Domain.Events;

namespace WorkoutTracker.Application.Handlers
{
    public class WorkoutCompletedEventHandler : INotificationHandler<WorkoutCompletedEvent>
    {
        private readonly ILogger<WorkoutCompletedEventHandler> _logger;

        public WorkoutCompletedEventHandler(ILogger<WorkoutCompletedEventHandler> logger)
        {
            _logger = logger;
        }

        public Task Handle(WorkoutCompletedEvent notification, CancellationToken cancellationToken)
        {
            // Log the workout completion (could also send notifications, update stats, etc.)
            _logger.LogInformation("Workout completed! User {UserId} finished workout '{WorkoutName}' (ID: {WorkoutId}) at {CompletedAt}",
                notification.UserId,
                notification.WorkoutName,
                notification.WorkoutId,
                notification.CompletedAt);

            // Here you could add other logic like:
            // - Send congratulations email
            // - Update user statistics
            // - Award achievements
            // - Update progress tracking

            return Task.CompletedTask;
        }
    }
}