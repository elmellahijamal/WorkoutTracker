using MediatR;

namespace WorkoutTracker.Application.Commands
{
    public class UpdateWorkoutExerciseCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public int Sets { get; set; }
        public int Reps { get; set; }
        public decimal? Weight { get; set; }
        public string Notes { get; set; }
    }
}