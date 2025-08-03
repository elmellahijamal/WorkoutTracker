using MediatR;
using WorkoutTracker.Application.Commands;
using WorkoutTracker.Domain.Entities;
using WorkoutTracker.Domain.Exceptions;
using WorkoutTracker.Domain.Interfaces;

namespace WorkoutTracker.Application.Handlers
{
    public class CreateWorkoutHandler : IRequestHandler<CreateWorkoutCommand, int>
    {
        private readonly IWorkoutRepository _workoutRepository;
        private readonly IUserRepository _userRepository;

        public CreateWorkoutHandler(IWorkoutRepository workoutRepository, IUserRepository userRepository)
        {
            _workoutRepository = workoutRepository;
            _userRepository = userRepository;
        }

        public async Task<int> Handle(CreateWorkoutCommand request, CancellationToken cancellationToken)
        {
            // Check if user exists
            var userExists = await _userRepository.ExistsAsync(request.UserId);
            if (!userExists)
            {
                throw new BusinessException("User not found");
            }

            var workout = new Workout
            {
                Name = request.Name,
                Date = request.Date,
                UserId = request.UserId,
                IsCompleted = false
            };

            var createdWorkout = await _workoutRepository.AddAsync(workout);
            return createdWorkout.Id;
        }
    }
}