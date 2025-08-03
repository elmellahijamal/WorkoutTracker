using MediatR;

namespace WorkoutTracker.Application.Commands
{
    public class UpdateWorkoutCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public bool IsCompleted { get; set; }
    }
}