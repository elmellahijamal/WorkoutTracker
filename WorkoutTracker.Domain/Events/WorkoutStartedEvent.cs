using MediatR;

namespace WorkoutTracker.Domain.Events
{
    public class WorkoutStartedEvent : INotification
    {
        public int WorkoutId { get; set; }
        public int UserId { get; set; }
        public string WorkoutName { get; set; }
        public DateTime StartedAt { get; set; }

        public WorkoutStartedEvent(int workoutId, int userId, string workoutName)
        {
            WorkoutId = workoutId;
            UserId = userId;
            WorkoutName = workoutName;
            StartedAt = DateTime.UtcNow;
        }
    }
}