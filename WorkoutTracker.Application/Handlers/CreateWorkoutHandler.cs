using MediatR;
using WorkoutTracker.Application.Commands;
using WorkoutTracker.Domain.Entities;
using WorkoutTracker.Domain.Exceptions;
using WorkoutTracker.Domain.Interfaces;
using WorkoutTracker.Domain.ValueObjects;

namespace WorkoutTracker.Application.Handlers
{
    public class CreateWorkoutHandler : IRequestHandler<CreateWorkoutCommand, int>
    {
        private readonly IWorkoutRepository _workoutRepository;
        private readonly IUserRepository _userRepository;
        private readonly IExerciseRepository _exerciseRepository;

        public CreateWorkoutHandler(
            IWorkoutRepository workoutRepository,
            IUserRepository userRepository,
            IExerciseRepository exerciseRepository)
        {
            _workoutRepository = workoutRepository;
            _userRepository = userRepository;
            _exerciseRepository = exerciseRepository;
        }

        public async Task<int> Handle(CreateWorkoutCommand request, CancellationToken cancellationToken)
        {
            var coach = await _userRepository.GetByIdAsync(request.CoachId);
            if (coach == null || coach.Role != UserRole.Coach)
                throw new BusinessException("Only coaches can create workouts");

            var user = await _userRepository.GetByIdAsync(request.UserId);
            if (user == null)
                throw new NotFoundException("Assigned user not found");

            var workout = new Workout
            {
                Name = request.Name,
                Date = request.Date,
                UserId = request.UserId,
                AssignedByCoachId = request.CoachId,
                IsCompleted = false
            };

            foreach (var exerciseDto in request.Exercises)
            {
                var exercise = await _exerciseRepository.GetByIdAsync(exerciseDto.ExerciseId);
                if (exercise == null)
                    throw new NotFoundException($"Exercise with ID {exerciseDto.ExerciseId} not found");

                workout.WorkoutExercises.Add(new WorkoutExercise
                {
                    ExerciseId = exerciseDto.ExerciseId,
                    Sets = exerciseDto.Sets,
                    Reps = exerciseDto.Reps,
                    Weight = exerciseDto.Weight,
                    Notes = exerciseDto.Notes
                });
            }

            var createdWorkout = await _workoutRepository.AddAsync(workout);
            return createdWorkout.Id;
        }
    }
}
