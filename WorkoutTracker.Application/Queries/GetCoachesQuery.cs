using MediatR;
using WorkoutTracker.Application.DTOs;
using WorkoutTracker.Application.DTOS;

namespace WorkoutTracker.Application.Queries
{
    public class GetCoachesQuery : IRequest<IEnumerable<UserDto>>
    {
    }
}