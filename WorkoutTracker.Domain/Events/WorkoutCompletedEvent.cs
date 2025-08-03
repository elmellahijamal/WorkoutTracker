using MediatR;

namespace WorkoutTracker.Domain.Events
{
    public class WorkoutCompletedEvent : INotification
    {
        public int WorkoutId { get; set; }
        public int UserId { get; set; }
        public DateTime CompletedAt { get; set; }
        public string WorkoutName { get; set; }

        public WorkoutCompletedEvent(int workoutId, int userId, string workoutName)
        {
            WorkoutId = workoutId;
            UserId = userId;
            WorkoutName = workoutName;
            CompletedAt = DateTime.UtcNow;
        }
    }
}