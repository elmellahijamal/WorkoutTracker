using MediatR;
using WorkoutTracker.Application.Commands;
using WorkoutTracker.Domain.Exceptions;
using WorkoutTracker.Domain.Interfaces;

namespace WorkoutTracker.Application.Handlers
{
    public class AssignWorkoutHandler : IRequestHandler<AssignWorkoutCommand, bool>
    {
        private readonly IWorkoutRepository _workoutRepository;
        private readonly IUserRepository _userRepository;

        public AssignWorkoutHandler(IWorkoutRepository workoutRepository, IUserRepository userRepository)
        {
            _workoutRepository = workoutRepository;
            _userRepository = userRepository;
        }

        public async Task<bool> Handle(AssignWorkoutCommand request, CancellationToken cancellationToken)
        {
            var workout = await _workoutRepository.GetByIdAsync(request.WorkoutId);
            if (workout == null) throw new NotFoundException("Workout not found");

            if (workout.UserId != 0) throw new BusinessException("Workout already assigned to a user");

            if (!await _userRepository.ExistsAsync(request.UserId))
                throw new NotFoundException("User not found");

            workout.UserId = request.UserId;
            workout.Date = request.AssignmentDate;

            await _workoutRepository.UpdateAsync(workout);
            return true;
        }
    }
}