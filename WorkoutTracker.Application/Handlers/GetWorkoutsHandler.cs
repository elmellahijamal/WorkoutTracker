using MediatR;
using WorkoutTracker.Application.DTOS;
using WorkoutTracker.Application.Queries;
using WorkoutTracker.Domain.Interfaces;

namespace WorkoutTracker.Application.Handlers
{
    public class GetWorkoutsHandler : IRequestHandler<GetWorkoutsQuery, List<WorkoutDto>>
    {
        private readonly IWorkoutRepository _workoutRepository;
        private readonly IUserRepository _userRepository;

        public GetWorkoutsHandler(IWorkoutRepository workoutRepository, IUserRepository userRepository)
        {
            _workoutRepository = workoutRepository;
            _userRepository = userRepository;
        }

        public async Task<List<WorkoutDto>> Handle(GetWorkoutsQuery request, CancellationToken cancellationToken)
        {
            var userExists = await _userRepository.ExistsAsync(request.UserId);
            if (!userExists)
            {
                throw new WorkoutTracker.Domain.Exceptions.NotFoundException("User not found.");
            }

            var workouts = await _workoutRepository.GetByUserIdAsync(request.UserId);

            return workouts.Select(w => new WorkoutDto
            {
                Id = w.Id,
                Name = w.Name,
                Date = w.Date,
                IsCompleted = w.IsCompleted,
                UserId = w.UserId,
                Exercises = w.WorkoutExercises?.Select(we => new ExerciseDto
                {
                    Id = we.Exercise.Id,
                    Name = we.Exercise.Name,
                    Description = we.Exercise.Description,
                    MuscleGroup = we.Exercise.MuscleGroup,
                    Sets = we.Sets,
                    Reps = we.Reps,
                    Weight = we.Weight,
                    Notes = we.Notes
                }).ToList() ?? new List<ExerciseDto>()
            }).ToList();
        }
    }
}