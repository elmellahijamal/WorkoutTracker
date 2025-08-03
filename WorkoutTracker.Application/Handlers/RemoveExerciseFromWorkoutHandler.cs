using MediatR;
using WorkoutTracker.Application.Commands;
using WorkoutTracker.Domain.Interfaces;

namespace WorkoutTracker.Application.Handlers
{
    public class RemoveExerciseFromWorkoutHandler : IRequestHandler<RemoveExerciseFromWorkoutCommand, bool>
    {
        private readonly IWorkoutExerciseRepository _workoutExerciseRepository;

        public RemoveExerciseFromWorkoutHandler(IWorkoutExerciseRepository workoutExerciseRepository)
        {
            _workoutExerciseRepository = workoutExerciseRepository;
        }

        public async Task<bool> Handle(RemoveExerciseFromWorkoutCommand request, CancellationToken cancellationToken)
        {
            if (!await _workoutExerciseRepository.ExistsAsync(request.WorkoutExerciseId))
                throw new WorkoutTracker.Domain.Exceptions.BusinessException("Workout exercise not found");

            await _workoutExerciseRepository.DeleteAsync(request.WorkoutExerciseId);
            return true;
        }
    }
}