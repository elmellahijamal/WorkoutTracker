using MediatR;
using WorkoutTracker.Application.Commands;
using WorkoutTracker.Domain.Entities;
using WorkoutTracker.Domain.Interfaces;

namespace WorkoutTracker.Application.Handlers
{
    public class AddExerciseToWorkoutHandler : IRequestHandler<AddExerciseToWorkoutCommand, int>
    {
        private readonly IWorkoutExerciseRepository _workoutExerciseRepository;
        private readonly IWorkoutRepository _workoutRepository;
        private readonly IExerciseRepository _exerciseRepository;

        public AddExerciseToWorkoutHandler(IWorkoutExerciseRepository workoutExerciseRepository, IWorkoutRepository workoutRepository, IExerciseRepository exerciseRepository)
        {
            _workoutExerciseRepository = workoutExerciseRepository;
            _workoutRepository = workoutRepository;
            _exerciseRepository = exerciseRepository;
        }

        public async Task<int> Handle(AddExerciseToWorkoutCommand request, CancellationToken cancellationToken)
        {
            // Validate workout and exercise exist
            if (!await _workoutRepository.ExistsAsync(request.WorkoutId))
                throw new WorkoutTracker.Domain.Exceptions.BusinessException("Workout not found");

            if (!await _exerciseRepository.ExistsAsync(request.ExerciseId))
                throw new WorkoutTracker.Domain.Exceptions.BusinessException("Exercise not found");

            var workoutExercise = new WorkoutExercise
            {
                WorkoutId = request.WorkoutId,
                ExerciseId = request.ExerciseId,
                Sets = request.Sets,
                Reps = request.Reps,
                Weight = request.Weight,
                Notes = request.Notes
            };

            var createdWorkoutExercise = await _workoutExerciseRepository.AddAsync(workoutExercise);
            return createdWorkoutExercise.Id;
        }
    }
}