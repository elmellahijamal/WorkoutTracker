using MediatR;
using WorkoutTracker.Application.DTOS;

namespace WorkoutTracker.Application.Queries
{
    public class GetUserByIdQuery : IRequest<UserDto>
    {
        public int Id { get; set; }
    }
}