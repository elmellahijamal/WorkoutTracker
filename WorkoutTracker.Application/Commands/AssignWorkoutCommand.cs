using MediatR;

namespace WorkoutTracker.Application.Commands
{
    public class AssignWorkoutCommand : IRequest<bool>
    {
        public int WorkoutId { get; set; }
        public int UserId { get; set; }
        public DateTime AssignmentDate { get; set; }
    }
}