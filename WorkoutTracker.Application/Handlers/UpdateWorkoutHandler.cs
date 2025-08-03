using MediatR;
using WorkoutTracker.Application.Commands;
using WorkoutTracker.Domain.Interfaces;

namespace WorkoutTracker.Application.Handlers
{
    public class UpdateWorkoutHandler : IRequestHandler<UpdateWorkoutCommand, bool>
    {
        private readonly IWorkoutRepository _workoutRepository;

        public UpdateWorkoutHandler(IWorkoutRepository workoutRepository)
        {
            _workoutRepository = workoutRepository;
        }

        public async Task<bool> Handle(UpdateWorkoutCommand request, CancellationToken cancellationToken)
        {
            var workout = await _workoutRepository.GetByIdAsync(request.Id);
            if (workout == null) return false;

            workout.Name = request.Name;
            workout.Date = request.Date;
            workout.IsCompleted = request.IsCompleted;

            await _workoutRepository.UpdateAsync(workout);
            return true;
        }
    }
}