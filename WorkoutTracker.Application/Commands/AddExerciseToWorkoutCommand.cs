using MediatR;

namespace WorkoutTracker.Application.Commands
{
    public class AddExerciseToWorkoutCommand : IRequest<int>
    {
        public int WorkoutId { get; set; }
        public int ExerciseId { get; set; }
        public int Sets { get; set; }
        public int Reps { get; set; }
        public decimal? Weight { get; set; }
        public string Notes { get; set; } = "";
    }
}