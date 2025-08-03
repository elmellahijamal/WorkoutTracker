using MediatR;
using WorkoutTracker.Application.DTOS;

namespace WorkoutTracker.Application.Queries
{
    public class GetWorkoutByIdQuery : IRequest<WorkoutDto>
    {
        public int Id { get; set; }
    }
}