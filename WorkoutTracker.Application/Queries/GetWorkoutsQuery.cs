using MediatR;
using WorkoutTracker.Application.DTOS;

namespace WorkoutTracker.Application.Queries
{
    public class GetWorkoutsQuery : IRequest<List<WorkoutDto>>
    {
        public int UserId { get; set; }

        public GetWorkoutsQuery(int userId)
        {
            UserId = userId;
        }
    }
}