using MediatR;
using WorkoutTracker.Application.DTOs;
using WorkoutTracker.Application.DTOS;
using WorkoutTracker.Application.Queries;
using WorkoutTracker.Domain.Interfaces;
using WorkoutTracker.Domain.ValueObjects;

namespace WorkoutTracker.Application.Handlers
{
    public class GetCoachesHandler : IRequestHandler<GetCoachesQuery, IEnumerable<UserDto>>
    {
        private readonly IUserRepository _userRepository;

        public GetCoachesHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<UserDto>> Handle(GetCoachesQuery request, CancellationToken cancellationToken)
        {
            var users = await _userRepository.GetAllAsync();

            // Only return coaches
            return users
                .Where(u => u.Role == UserRole.Coach)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Username = u.Username,
                    Email = u.Email,
                    CreatedAt = u.CreatedAt,
                    Role = u.Role.ToString()
                });
        }
    }
}