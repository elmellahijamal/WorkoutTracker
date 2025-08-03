namespace WorkoutTracker.Application.DTOs
{
    public class AddExerciseToWorkoutDto
    {
        public int ExerciseId { get; set; }
        public int Sets { get; set; }
        public int Reps { get; set; }
        public decimal? Weight { get; set; }
        public string Notes { get; set; } = "";
    }
}