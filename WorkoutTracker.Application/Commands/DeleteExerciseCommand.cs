using MediatR;

namespace WorkoutTracker.Application.Commands
{
    public class DeleteExerciseCommand : IRequest<bool>
    {
        public int Id { get; set; }
    }
}