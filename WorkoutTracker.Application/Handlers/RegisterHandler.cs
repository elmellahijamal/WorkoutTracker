using BCrypt.Net;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WorkoutTracker.Application.Commands;
using WorkoutTracker.Application.DTOs;
using WorkoutTracker.Application.DTOS;
using WorkoutTracker.Domain.Entities;
using WorkoutTracker.Domain.Events;
using WorkoutTracker.Domain.Interfaces;
using WorkoutTracker.Domain.ValueObjects;
using WorkoutTracker.Infrastructure;
using WorkoutTracker.Infrastructure.Services;

namespace WorkoutTracker.Application.Handlers
{
    public class RegisterHandler : IRequestHandler<RegisterCommand, LoginResponseDto>
    {
        private readonly IJwtService _jwtService;
        private readonly IMediator _mediator;
        private readonly IUserRepository _userRepository;

        public RegisterHandler(IUserRepository userRepository, IJwtService jwtService, IMediator mediator)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
            _mediator = mediator;
        }

        public async Task<LoginResponseDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            // Check if username already exists
            if (await _userRepository.ExistsByUsernameAsync(request.Username))
                throw new WorkoutTracker.Domain.Exceptions.BusinessException("Username already exists");

            var user = new User
            {
                Name = request.Name,
                Username = request.Username,
                Email = request.Email ?? "",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = request.IsCoach ? UserRole.Coach : UserRole.User,
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.AddAsync(user);

            // Publish domain event
            var userCreatedEvent = new UserCreatedEvent(user.Id, user.Name, user.Email);
            await _mediator.Publish(userCreatedEvent, cancellationToken);

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