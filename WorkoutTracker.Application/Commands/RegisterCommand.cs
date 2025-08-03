using MediatR;
using WorkoutTracker.Application.DTOs;

namespace WorkoutTracker.Application.Commands
{
    public class RegisterCommand : IRequest<LoginResponseDto>
    {
        public string Name { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }
}