using MediatR;
using WorkoutTracker.Application.Commands;
using WorkoutTracker.Domain.Entities;
using WorkoutTracker.Domain.Interfaces;
using WorkoutTracker.Domain.Events;

namespace WorkoutTracker.Application.Handlers
{
    public class CreateUserHandler : IRequestHandler<CreateUserCommand, int>
    {
        private readonly IUserRepository _userRepository;
        private readonly IMediator _mediator;

        public CreateUserHandler(IUserRepository userRepository, IMediator mediator)
        {
            _userRepository = userRepository;
            _mediator = mediator;
        }

        public async Task<int> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {
            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                CreatedAt = DateTime.UtcNow
            };

            var createdUser = await _userRepository.AddAsync(user);

            // Publish domain event
            var userCreatedEvent = new UserCreatedEvent(createdUser.Id, createdUser.Name, createdUser.Email);
            await _mediator.Publish(userCreatedEvent, cancellationToken);

            return createdUser.Id;
        }
    }
}