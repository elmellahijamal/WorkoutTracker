using MediatR;
using Microsoft.EntityFrameworkCore;
using WorkoutTracker.Application.Commands;
using WorkoutTracker.Application.DTOs;
using WorkoutTracker.Application.DTOS;
using WorkoutTracker.Domain.Interfaces;
using WorkoutTracker.Infrastructure;
using WorkoutTracker.Infrastructure.Services;

namespace WorkoutTracker.Application.Handlers
{
    public class LoginHandler : IRequestHandler<LoginCommand, LoginResponseDto>
    {
        private readonly IJwtService _jwtService;
        private readonly IUserRepository _userRepository;

        public LoginHandler(IUserRepository userRepository, IJwtService jwtService)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
        }

        public async Task<LoginResponseDto> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByUsernameAsync(request.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                throw new WorkoutTracker.Domain.Exceptions.BusinessException("Invalid username or password");

            var token = _jwtService.GenerateToken(user);

            return new LoginResponseDto
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Username = user.Username,
                    CreatedAt = user.CreatedAt,
                    Role = user.Role.ToString()
                }
            };
        }
    }
}