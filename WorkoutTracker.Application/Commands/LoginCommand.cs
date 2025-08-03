using MediatR;
using WorkoutTracker.Application.DTOs;

namespace WorkoutTracker.Application.Commands
{
    public class LoginCommand : IRequest<LoginResponseDto>
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}