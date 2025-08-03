using MediatR;

namespace WorkoutTracker.Application.Commands
{
    public class RemoveExerciseFromWorkoutCommand : IRequest<bool>
    {
        public int WorkoutExerciseId { get; set; }
    }
}