using MediatR;
using WorkoutTracker.Domain.ValueObjects;

namespace WorkoutTracker.Application.Commands
{
    public class UpdateExerciseCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public MuscleGroup MuscleGroup { get; set; }
    }
}