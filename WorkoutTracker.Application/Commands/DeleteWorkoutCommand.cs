using MediatR;

namespace WorkoutTracker.Application.Commands
{
    public class DeleteWorkoutCommand : IRequest<bool>
    {
        public int Id { get; set; }
    }
}