namespace WorkoutTracker.Domain.Entities
{
    public class Workout
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public int? UserId { get; set; }
        public int? AssignedByCoachId { get; set; }
        public bool IsCompleted { get; set; }
        public User? User { get; set; }
        public User? AssignedByCoach { get; set; }

        public ICollection<WorkoutExercise> WorkoutExercises { get; set; } = new List<WorkoutExercise>();
    }
}