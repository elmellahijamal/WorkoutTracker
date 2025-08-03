using MediatR;
using WorkoutTracker.Application.DTOS;

namespace WorkoutTracker.Application.Queries
{
    public class GetExerciseByIdQuery : IRequest<ExerciseDto>
    {
        public int Id { get; set; }
    }
}