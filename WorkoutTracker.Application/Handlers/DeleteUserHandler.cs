using MediatR;
using WorkoutTracker.Application.Commands;
using WorkoutTracker.Domain.Exceptions;
using WorkoutTracker.Domain.Interfaces;

namespace WorkoutTracker.Application.Handlers
{
    public class DeleteUserHandler : IRequestHandler<DeleteUserCommand, bool>
    {
        private readonly IUserRepository _userRepository;

        public DeleteUserHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<bool> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
        {
            var success = await _userRepository.DeleteAsync(request.Id);
            if (!success)
                throw new NotFoundException("User not found.");
            return true;
        }
    }
}