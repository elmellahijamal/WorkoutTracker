using MediatR;
using WorkoutTracker.Application.Commands;
using WorkoutTracker.Domain.Interfaces;

namespace WorkoutTracker.Application.Handlers
{
    public class UpdateWorkoutExerciseHandler : IRequestHandler<UpdateWorkoutExerciseCommand, bool>
    {
        private readonly IWorkoutExerciseRepository _workoutExerciseRepository;

        public UpdateWorkoutExerciseHandler(IWorkoutExerciseRepository workoutExerciseRepository)
        {
            _workoutExerciseRepository = workoutExerciseRepository;
        }

        public async Task<bool> Handle(UpdateWorkoutExerciseCommand request, CancellationToken cancellationToken)
        {
            var workoutExercise = await _workoutExerciseRepository.GetByIdAsync(request.Id);
            if (workoutExercise == null)
                throw new WorkoutTracker.Domain.Exceptions.BusinessException("Workout exercise not found");

            workoutExercise.Sets = request.Sets;
            workoutExercise.Reps = request.Reps;
            workoutExercise.Weight = request.Weight;
            workoutExercise.Notes = request.Notes;

            await _workoutExerciseRepository.UpdateAsync(workoutExercise);
            return true;
        }
    }
}